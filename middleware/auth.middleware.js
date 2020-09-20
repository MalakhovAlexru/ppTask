const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const userData = await User.findOne({ nickName: req.body.nickName });
    const { token } = userData;

    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Нет авторизации', error });
  }
};
