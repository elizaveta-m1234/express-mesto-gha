const Card = require('../models/card');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(404).send({ message: 'Карточка с указанным _id не найдена' }));
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
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
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
