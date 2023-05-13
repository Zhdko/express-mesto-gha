const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { secretKey } = require('../utils/constants');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace(bearer, '');

  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;
  return next();

  // const token = req.cookies.jwt;

  // if (!token) {
  //   return next(new AuthorizationError('Необходима авторизация.'));
  // }

  // let payload;
  // try {
  //   payload = jwt.verify(token, secretKey);
  // } catch (err) {
  //   return next(new AuthorizationError('Необходима авторизация.'));
  // }

  // req.user = payload;

  // return next();
};
