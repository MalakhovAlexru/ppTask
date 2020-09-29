const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const currencyCodes = require('../../CurrencyCodes');
const Currency = require('../../models/Currency');
const User = require('../../models/User');

const { validationResult } = require('express-validator');

module.exports.signUp = async (req, res) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоретные данные при регистрации',
      });
    }

    const { nickName, password, currencyCharCode } = req.body;

    // const { CharCode, NumCode } = currencyCodes[currencyCharCode];

    const candidate = await User.findOne({
      nickName,
    });

    if (candidate) {
      return res.status(400).json({
        message: 'Пользователь существует',
      });
    }

    // TODO: доделать создание и привязку к валюте на бэке

    // let currencyCodeInMongo = await Currency.findOne({ CharCode: currencyCharCode });

    // console.log('currencyCodeInMongo is ', currencyCodeInMongo);

    // if (!currencyCodeInMongo || currencyCodeInMongo === 'null') {
    //   // const { CharCode, NumCode } = currencyCodes[currencyCharCode];
    //   const currency = new Currency({
    //     CharCode,
    //     NumCode,
    //   });
    //   currencyCodeInMongo = await (await currency.save())._id;
    // }

    const hashedPassword = (await bcrypt.hash(password, 12)).toString();
    const user = new User({
      nickName,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: 'Пользователь создан',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка на сервере',
      error,
    });
  }
};

module.exports.login = async (req, res) => {
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
};

module.exports.logout = async (req, res) => {
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
};
