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
      .then((user) => {
        const { text, id } = user.questionData[user.currentQuestionIndex].question;
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

    if (!answer) {
      const err = new Error('`answer` required');
      err.code = 400;
      throw err;
    }

    let correct;
    let currentQuestionData;
    User.findById(req.user.id)
      .then((user) => {
        currentQuestionData = user.questionData[user.currentQuestionIndex];
        if (question.id !== currentQuestionData.question.id) {
          const err = new Error('Invalid question id');
          err.code = 422;
          throw err;
        }

        correct = parseFloat(answer) === currentQuestionData.question.answer;

        return user.recordAnswer(correct);
      })
      .then(() => {
        res.json({
          question: currentQuestionData.question,
          feedback: {
            correct,
          },
        });
      })
      .catch(next);
  });

module.exports = router;
