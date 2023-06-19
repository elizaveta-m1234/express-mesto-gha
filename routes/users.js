const router = require('express').Router();
const {
  getUsers,
  getUserId,
  createUser,
  editProfile,
  editAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает пользователя по _id
router.get('/:userId', getUserId);
// создаёт пользователя
router.post('/', createUser);
// обновляет профиль
router.patch('/me', editProfile);
// обновляет аватар
router.patch('/me', editAvatar);
module.exports = router;
