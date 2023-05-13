const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { secretKey } = require('../utils/constants');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthorizationError('Необходима jjjавторизация.'));
  }

  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new AuthorizationError('Необходима vvvавторизация.'));
  }

  req.user = payload;

  return next();
};
