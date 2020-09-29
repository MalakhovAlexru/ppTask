const express = require('express');

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth.middleware');
const { logout, login, signUp } = require('./auth.controller');

const router = express.Router();

// Add new user

/**
 * Solves equations of the form a * x = b
 * @example
 * // returns 2
 * globalNS.method1(5, 10);
 * @example
 * // returns 3
 * globalNS.method(5, 15);
 * @returns {Number} Returns the value of x for the equation.
 */

/**
 * @param {string} nickName - The title of the book.
 * @param {string} Password - The author of the book.
 * @param {string} currencyCharCode - The author of the book.
 *
 */

router.post(
  '/signup',
  [
    check('currencyCharCode').exists(),
    check('password', 'Некоретный пароль').isLength({
      min: 6,
    }),
  ],
  signUp
);

// Login in system and get new token
/**
 * @api {post} /login Вход в систему и получение временного токена
 *
 */
router.post('/login', [check('password', 'Некоретный пароль').exists()], login);

// Logout
/**
 * @api {post} /logout Выход из системы и анулирование токена
 *
 */
router.post('/logout', logout);

module.exports = router;
