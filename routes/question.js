'use strict';

const express = require('express');
const passport = require('passport');

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
        const { text, id } = user.questions[user.currentQuestionIndex];
        res.json({ question: { text, id } });
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { question, answer } = req.body;

    if (!question || !question.id) {
      const err = new Error('`question.id` required in request body');
      err.code = 400;
      throw err;
    }

    if(!answer) {
      const err = new Error('`answer` required');
      err.code = 400;
      throw err;
    }

    let correct;
    let currentQuestion;
    User.findById(req.user.id)
      .populate('questions')
      .then((user) => {
        currentQuestion = user.questions[user.currentQuestionIndex];
        if (question.id !== currentQuestion.id) {
          const err = new Error('Invalid question id');
          err.code = 422;
          throw err;
        }

        correct = parseFloat(answer) === currentQuestion.answer;

        return user.incrementQuestionIndex();
      })
      .then(() => {
        res.json({
          question: currentQuestion,
          feedback: {
            correct,
          }
        });
      })
      .catch(next);
  });

module.exports = router;
