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
        nextQuestion: Number,
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
        delete result.questionData;
        delete result.currentQuestionIndex;
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
  if (this.questionData.length > 0) {
    return Promise.resolve(this);
  }

  return Question.find().then((questions) => {
    this.questionData = questions.map((question, index) => ({
      question,
      nextQuestion: index < questions.length - 1 ? index + 1 : null,
    }));

    return this.save();
  });
};

userSchema.methods.recordAnswer = function userRecordAnswer(answeredCorrectly) {
  const { currentQuestionIndex } = this;
  const currentQuestion = this.questionData[currentQuestionIndex];

  currentQuestion.history[answeredCorrectly ? 'correct' : 'incorrect'] += 1;

  this.currentQuestionIndex = this.questionData[currentQuestionIndex].nextQuestion || 0;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
