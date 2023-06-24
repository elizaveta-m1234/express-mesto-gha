const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  created, badRequest, notFound, internalServerError,
} = require('../utils/constants');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(internalServerError).send({ message: 'Ошибка по умолчанию' }));
};

// возвращает пользователя по _id
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res) => {
  const id = req.user._id;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет профиль
module.exports.editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет аватар
module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// контроллер login, который получает из запроса почту и пароль и проверяет их
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );
      // рекомендуем записывать JWT в httpOnly куку.
      res.cookie('jwt', token, { httpOnly: true }).send(token).end();
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};
