'use strict';

const express = require('express');

const users = require('./users');
const auth = require('./auth');
const question = require('./question');

const router = express.Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/question', question);

module.exports = router;
