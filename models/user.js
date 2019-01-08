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
    questionData: [
      {
        question: Question.schema,
        history: {
          correct: { type: Number, default: 0 },
          incorrect: { type: Number, default: 0 },
        },
      },
    ],
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
  return Question.find().then((questions) => {
    this.questionData = questions.map((question) => ({ question }));
    return this.save();
  });
};

userSchema.methods.recordAnswer = function userRecordAnswer(answeredCorrectly) {
  const { currentQuestionIndex } = this;
  const currentQuestion = this.questionData[currentQuestionIndex];

  currentQuestion.history[answeredCorrectly ? 'correct' : 'incorrect'] += 1;

  this.currentQuestionIndex = (currentQuestionIndex + 1) % this.questionData.length;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
