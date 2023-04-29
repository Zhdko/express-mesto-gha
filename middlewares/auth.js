const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = req.headers.cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
