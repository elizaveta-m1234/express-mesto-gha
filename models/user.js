const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    // required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    default: 'Жак-Ив Кусто',
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: { // опишем требования к имени в схеме:
    type: String, // это строка
    // required: true, // обязательное поле
    default: 'Исследователь',
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, //  это строка
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: true, // оно должно быть у каждого пользователя
  },
  email: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    unique: true, // уникальность
    validate: {
      validator(mail) {
        return validator.isEmail(mail);
      },
      message: 'Введите адрес электронной почты',
    },
  },
  password: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 8, // минимальная длина — 8 символа
    select: false, // необходимо добавить поле select
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
// eslint сказал назвать функцию, в тренажере она без имени
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
