const DefaultError = require('./DefaultError');
const NotFoundError = require('./NotFoundError');
const RequestError = require('./RequestError');

const handleErrors = (err, req, res, next) => {
  if (err.message === 'Not found') {
    next(new NotFoundError('Пользователь по указанному _id не найден.'));
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');
    next(new RequestError({ message }));
  } else {
    next(new DefaultError('Что-то пошло не так'));
  }
};

module.exports = { handleErrors };
