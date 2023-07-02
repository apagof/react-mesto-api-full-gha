const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const findById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  findById(req, res, next, _id);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  findById(req, res, next, userId);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const { ...userData } = user.toObject();
      delete userData.password;
      res.status(201).send({ data: userData });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next, args) => {
  User.findByIdAndUpdate(req.user._id, args, { new: true, runValidators: true })
    .then((user) => next(res.send(user)))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  updateUserData(req, res, next, { name, about });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserData(req, res, next, { avatar });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
    // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      // вернём токен

      // отправим токен, браузер сохранит его в куках

      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};
