const User = require('../models/user');
const {
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  DATA__ERROR,
} = require('../utils/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' })
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'CastError') {
        res.status(DATA__ERROR).send({ message: 'Передан некорректный id' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(DATA__ERROR).send({ message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(DATA__ERROR).send({ message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'ValidationError') {
        res.status(DATA__ERROR).send({ message: 'Передан некорректный id' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
