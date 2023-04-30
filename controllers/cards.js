const Card = require('../models/card');
const DefaultError = require('../errors/DefaultError');
const handleErrors = require('../errors/handleError');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const ConflictError = require('../errors/ConflictError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => next(new DefaultError('Что-то пошло не так')));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      handleErrors(err, req, res, next);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    const owner = card.owner.toString();
    if (_id !== owner) {
      throw new ConflictError('Только владелец карточки может ее удалить');
    }

    Card.findByIdAndRemove(card).catch(next);
  }).then((card) => res.send(card)).catch(next);
  // Card.findById(cardId).orFail(() => { throw new NotFoundError('Карточка не найдена'); })
  //   .then((card) => {
  //     if (_id === card.owner.toString()) {
  //       console.log('ohs');
  //       Card.findByIdAndRemove(cardId).then(() => res.send({ data: card }));
  //     }
  //     console.log('no');
  //     throw new ConflictError('У вас нет прав доступа');
  //   }).catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
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
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
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
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
