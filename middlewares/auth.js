const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { secretKey } = require('../utils/constants');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('1');

  if (!token) {
    return next(new AuthorizationError('Необходима jjjавторизация.'));
    console.log('2');
  }

  let payload;
  try {
    payload = jwt.verify(token, secretKey);
    console.log('3');
  } catch (err) {
    console.log('4');
    return next(new AuthorizationError('Необходима vvvавторизация.'));
  }

  req.user = payload;
  console.log(payload);

  return next();
};
