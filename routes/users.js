'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

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
    .then((result) => {
      res
        .status(201)
        .location(`${req.baseUrl}/${result._id}`)
        .json(result);
    })
    .catch((err) => {
      if (err.code === 11000 && err.name === 'MongoError') {
        // Username already exists
        err.status = 400;
        return Promise.reject(err);
      }
    })
    .catch(next);
});

module.exports = router;
