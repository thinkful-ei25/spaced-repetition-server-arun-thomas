'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/', (req, res, next) => {
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
