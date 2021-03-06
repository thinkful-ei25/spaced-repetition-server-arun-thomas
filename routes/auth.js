'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRY } = require('../config'); // set up in config

const router = express.Router();

const localAuth = passport.authenticate('local', { session: false, failWithError: true });

router.post('/login', localAuth, (req, res, next) => {
  const authToken = createAuthToken(req.user);

  req.user.generateQuestions()
    .then(() => res.json({ authToken }))
    .catch(next);
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;
