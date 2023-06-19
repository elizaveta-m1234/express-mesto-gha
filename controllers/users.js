const User = require('../models/user');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .orFail()
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

// возвращает пользователя по _id
module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send(user))
    .orFail()
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .orFail()
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

// обновляет профиль
module.exports.editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(201).send(user))
    .orFail()
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// обновляет аватар
module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(201).send(user))
    .orFail()
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};