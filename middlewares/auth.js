/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  // рекомендуем записывать JWT в httpOnly куку - вынимаем
  const token = req.cookies.jwt.replace('Bearer ', '');

  if (!token) {
    next(Unauthorized);
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(Unauthorized);
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
