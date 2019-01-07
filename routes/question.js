'use strict';

const express = require('express');
const passport = require('passport');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use(jwtAuth);

router
  .route('/')
  .get((req, res) => {
    res.json({
      question: { text: 'How long does a L1 cache reference take to complete?' },
    });
  })
  .post((req, res) => {
    res.json({
      question: {
        text: 'How long does a L1 cache reference take to complete?',
        answer: '0.5 ns',
      },
      feedback: { correct: true },
    });
  });

module.exports = router;
