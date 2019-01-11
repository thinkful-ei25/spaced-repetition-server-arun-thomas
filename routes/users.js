'use strict';

const express = require('express');
const passport = require('passport');

const User = require('../models/user');
const Session = require('../models/session');

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

function validateNewUser(req, res, next) {
  const { username, password } = req.body;

  let err;
  if (!username) {
    err = new Error('Username is required');
    err.location = 'username';
    err.code = 400;
  } else if (!password) {
    err = new Error('Password is required');
    err.location = 'password';
    err.code = 400;
  } else if (username.length < 1) {
    err = new Error('Username must be at least one character long');
    err.location = 'password';
    err.code = 422;
  } else if (password.length < 10 || password.length > 72) {
    err = new Error('Password must be between 10 and 72 characters long');
    err.location = 'password';
    err.code = 422;
  } else if(username.trim() !== username) {
    err = new Error('Username must not have leading/trailing whitespace');
    err.location = 'username';
    err.code = 422;
  } else if (password.trim() !== password) {
    err = new Error('Password must not have leading/trailing whitespace');
    err.location = 'password';
    err.code = 422;
  }

  if (err) {
    err.reason = 'ValidationError'; // For reduxForm
    next(err);
    return;
  }

  next();
}

router.post('/', validateNewUser, (req, res, next) => {
  const { username, password, firstName, lastName } = req.body;

  User.hashPassword(password)
    .then((digest) => User.create({ username, firstName, lastName, password: digest }))
    .then((user) => user.generateQuestions())
    .then((user) => {
      res
        .status(201)
        .location(`${req.baseUrl}/${user._id}`)
        .json(user);
    })
    .catch((err) => {
      if (err.code === 11000 && err.name === 'MongoError') {
        // Username already exists
        const err = new Error('Username already taken');
        err.location = 'username';
        err.code = 422;
        err.reason = 'ValidationError';

        return Promise.reject(err);
      }
    })
    .catch(next);
});

// added for sessions
router.post('/session', jwtAuth, (req, res, next) => {
  let session;
  User.findById(req.user.id)
    .then((user) => {
      session = user.sessions.create({});
      res.json({ session });
    })
    .catch(next);
});


module.exports = router;
