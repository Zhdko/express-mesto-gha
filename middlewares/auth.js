const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { secretKey } = require('../utils/constants');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthorizationError('Необходима авторизация.'));
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация.');
  }

  req.user = payload;

  next();
};
