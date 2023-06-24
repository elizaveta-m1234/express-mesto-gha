const router = require('express').Router();
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
router.get('/:userId', getUserId);
// обновляет профиль
router.patch('/me', editProfile);
// обновляет аватар
router.patch('/me/avatar', editAvatar);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);

module.exports = router;
