const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // рекомендуем записывать JWT в httpOnly куку - вынимаем
  const token = req.cookies.jwt.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
