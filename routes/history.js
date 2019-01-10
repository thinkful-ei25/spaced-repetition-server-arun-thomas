'use strict';

const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router.get('/', (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      const returnedData = user.questionData.map(data => {
        const { question, history } = data;
        return {
          id: question.id,
          text: question.text,
          history,
        };
      });
      res.json({ questions: returnedData});
    })
    .catch(next);
});

router.get('/sessions', (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      const { sessions } = user;
      res.json({ sessions });
    })
    .catch(next);
});

module.exports = router;
