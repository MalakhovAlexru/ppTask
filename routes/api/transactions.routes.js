/**
 * Transactions routes
 * url = localhost:{port}/api/transactions/
 */

const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const fetch = require('node-fetch');
const convert = require('xml-js');
const Transactions = require('../../models/Transaction');
const auth = require('../../middleware/auth.middleware');
const validDate = require('../../middleware/date.middleware');
const User = require('../../models/User');

const router = Router();

/**
 * @api {post} /api/transacions Создать новую транзакцию
 *
 */
router.post('/', [check('nickName').exists(), auth], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при создании новой транзакции',
      });
    }

    const user_id = req.user.userId;
    const { amount, type } = req.body;
    const date = req.customDate;

    const transaction = new Transactions({
      user_id,
      date,
      amount,
      type,
    });

    const transactionId = await (await transaction.save()).customTransId;

    res.status(201).json({
      message: 'Транзакция записана',
      transactionId,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка на сервере',
      error,
    });
  }
});

/**
 * @api {get} /api/transacions Получить список всех транзакций за день
 *
 */

router.get('/', [check('nickName').exists(), auth, validDate], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректные данные при запросе транзакций',
      });
    }

    let selectedDate = req.customDate.split(' ')[0];

    const filteredByDate = await Transactions.find({
      date: { $gte: `${selectedDate} 00:00:00`, $lte: `${selectedDate} 23:59:59` },
    });

    // подсчет всех транзакций
    let totalAmount = 0;
    // определение стоимости валюты

    // const dateForRequestCurr = selectedDate.split('-').reverse().join('/');
    const cbrfURL = `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${selectedDate.split('-').reverse().join('/')}`;
    let cbrfXML = '';
    await fetch(cbrfURL)
      .then((response) => response.text())
      .then((xmlString) => {
        cbrfXML = convert.xml2json(xmlString, { compact: true, spaces: 4 });
      });

    let cbrfXMLJSON = JSON.parse(cbrfXML);
    console.log(cbrfXMLJSON.ValCurs.Valute);
    // TODO Доделать запрос данных из ЦБ за конкретный день
    // .then((json) => console.log(json));

    filteredByDate.map((obj) => {
      if (obj.type === 'income') {
        totalAmount = totalAmount + obj.amount;
      } else {
        totalAmount = totalAmount - obj.amount;
      }
    });

    res.status(200).json({
      atDay: selectedDate,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка на сервере',
      error,
    });
  }
});

/**
 * @api {post} /api/transacions/:id транзакции определенного пользователя по его ID
 *
 */
router.get('/:id', auth, async (req, res) => {
  try {
    console.log(req.params.id);
    const userInMongo = await User.findOne({ customUserId: { $eq: req.params.id } });

    const filteredData = await Transactions.find({ user_id: userInMongo._id });

    res.status(200).json({
      byUserwithID: req.user.userId,
      filteredData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка на сервере',
    });
  }
});

module.exports = router;
