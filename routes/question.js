'use strict';

const express = require('express');
const passport = require('passport');

const Question = require('../models/question');
const User = require('../models/user');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router
  .route('/')
  .get((req, res, next) => {
    User.findById(req.user.id)
      .populate('questions')
      .then((user) => {
        const { text, id } = user.questions[0];
        res.json({ question: { text, id } });
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { question, answer } = req.body;
    Question.findById(question.id)
      .then((question) => {
        const correct = parseFloat(answer) === question.answer;

        res.json({
          question,
          feedback: {
            correct,
          },
        });
      })
      .catch(next);
  });

module.exports = router;
