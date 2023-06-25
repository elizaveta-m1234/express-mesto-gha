const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
router.get('/', getCards);
// создаёт карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri(({ scheme: ['http', 'https'] })),
  }).unknown(true),
}), createCard);
// удаляет карточку по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), deleteCard);
// поставить лайк карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), likeCard);
// убрать лайк с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), dislikeCard);

module.exports = router;
