const Card = require('../models/card');
const {
  created, badRequest, notFound, internalServerError,
} = require('../utils/constants');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(internalServerError).send({ message: 'Ошибка по умолчанию' }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const id = req.user._id;

  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err, card) => {
      if (id !== card.owner.toString()) {
        return res.status(badRequest).send({ message: 'ЗОПРЕЩЕНО' });
      }
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};

// убрать лайк с карточк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(internalServerError).send({ message: 'Ошибка по умолчанию' });
    });
};
