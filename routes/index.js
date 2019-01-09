'use strict';

const express = require('express');

const users = require('./users');
const auth = require('./auth');
const question = require('./question');
const history = require('./history');

const router = express.Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/question', question);
router.use('/history', history);

module.exports = router;
