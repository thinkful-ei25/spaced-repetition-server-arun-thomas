'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    answer: { type: Number, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, result) {
        delete result._id;
        delete result.__v;
        delete result.password;
      },
    },
  }
);

module.exports = mongoose.model('Question', questionSchema);
