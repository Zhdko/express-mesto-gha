const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const cardOwner = req.user;

  Card.create({ name, link, owner: cardOwner })
    .then((card) => {
      if (!card) throw new NotFoundError('Ошибка при создании карточки');
      card.populate('owner').then((cardInfo) => {
        res.status(201).send(cardInfo);
      }).catch(next);
    })
    .catch(next);
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

    card.deleteOne().then(() => res.send({ data: card })).catch(next);
  }).catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
