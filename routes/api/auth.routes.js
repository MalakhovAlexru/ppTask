const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth.middleware');
const currencyCodes = require('../../CurrencyCodes');
const User = require('../../models/User');
const Currency = require('../../models/Currency');

const router = express.Router();

// Add new user
/**
 * @api {post} /auth/signup Регистрация нового пользователя
 *
 */
router.post(
  '/signup',
  [
    check('currencyCode').exists(),
    check('password', 'Некоретный пароль').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некоретные данные при регистрации',
        });
      }

      const { nickName, password, currencyCode } = req.body;

      const candidate = await User.findOne({
        nickName,
      });

      if (candidate) {
        return res.status(400).json({
          message: 'Пользователь существует',
        });
      }

      let currencyCodeInMongo = await Currency.find({ CharCode: { $eq: currencyCode } })._id;
      if (!currencyCodeInMongo) {
        const { CharCode, NumCode } = currencyCodes[currencyCode];
        const currency = new Currency({
          CharCode,
          NumCode,
        });
        currencyCodeInMongo = await (await currency.save())._id;
      }

      const hashedPassword = (await bcrypt.hash(password, 12)).toString();
      const user = new User({
        nickName,
        password: hashedPassword,
        currency: currencyCodeInMongo,
      });

      await user.save();
      res.status(201).json({
        message: 'Пользователь создан',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка на сервере',
      });
    }
  }
);

// Login in system and get new token
/**
 * @api {post} /auth/login Вход в систему и получение временного токена
 *
 */
router.post('/login', [check('password', 'Некоретный пароль').exists()], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при входе в систему',
      });
    }

    const { nickName, password } = req.body;
    const user = await User.findOne({
      nickName,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Пользователь не найден',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Неверный пароль',
      });
    }
    console.log(user._id);
    const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'), {
      expiresIn: '3h',
    });

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      message: 'Вы авторизованы в системе',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка на сервере',
    });
  }
});

// Logout
/**
 * @api {post} /auth/logout Выход из системы и анулирование токена
 *
 */
router.post('/logout', async (req, res) => {
  try {
    const { nickName } = req.body;
    const user = await User.findOne({
      nickName,
    });

    const token = null;

    user.token = token;
    await user.save();

    res.status(200).json({
      message: 'Вы вышли из системы',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка на сервере',
    });
  }
});

module.exports = router;
