'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  correct: {type: Number, default: 0 },
  incorrect: {type: Number, default: 0 },
});

schema.set('timestamps', true);

// Transform output during `res.json(data)`, `console.log(data)` etc.
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Session', schema);