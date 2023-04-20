const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: 'Что-то пошло не так' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
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
