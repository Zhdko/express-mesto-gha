const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { secretKey } = require('../utils/constants');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация.'));
  }

  req.user = payload;

  return next();
};
