'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Question = require('./question');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    currentQuestionIndex: { type: Number, default: 0 },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, result) {
        delete result._id;
        delete result.__v;
        delete result.password;
        delete result.questions;
      },
    },
  }
);

userSchema.statics.hashPassword = function userHashPassword(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function userValidatePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateQuestions = function userGenerateQuestions() {
  return Question.find({}, 'id')
    .then(questions => {
      const questionIds = questions.map(question => question._id);
      this.questions = questionIds;
      return this.save();
    });
};

userSchema.methods.incrementQuestionIndex = function userIncrementQuestionIdx() {
  const { currentQuestionIndex } = this;
  this.currentQuestionIndex = (currentQuestionIndex + 1) % this.questions.length;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
