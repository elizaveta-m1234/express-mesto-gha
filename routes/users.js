/* eslint-disable linebreak-style */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserId,
  editProfile,
  editAvatar,
  getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает пользователя по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), getUserId);
// обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editProfile);
// обновляет аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(({ scheme: ['http', 'https'] })),
  }),
}), editAvatar);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);

module.exports = router;
