'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Question = require('./question');
const Session = require('./session');

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
        weight: { type: Number, default: 1 },
      },
    ],
    currentQuestionIndex: { type: Number, default: 0 },
    sessions: [Session.schema],
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

  if (answeredCorrectly) {
    currentQuestion.weight *= 2;
  } else {
    currentQuestion.weight = 1;
  }

  this.shiftHead(currentQuestion.weight);

  return this.save();
};

userSchema.methods.updateSession = function userUpdateSession(sessionId, answeredCorrectly) {
  const currentSession = this.sessions.id(sessionId);

  if (answeredCorrectly) {
    currentSession.correct += 1;
  } else {
    currentSession.incorrect +=1;
  }
};

userSchema.methods.shiftHead = function userShiftHead(numberOfPositions) {
  const { currentQuestionIndex: toBeMoved } = this;

  this.currentQuestionIndex = this.questionData[toBeMoved].nextQuestion;

  let current = toBeMoved;
  for (let i = 0 ; i < numberOfPositions && i < this.questionData.length - 1; i += 1) {
    current = this.questionData[current].nextQuestion;
  }
  this.questionData[toBeMoved].nextQuestion = this.questionData[current].nextQuestion;
  this.questionData[current].nextQuestion = toBeMoved;
};

userSchema.methods.pruneSessions = function userPruneSessions() {
  const prunedSessions = this.sessions.filter(
    (session) => session.correct || session.incorrect
  );

  this.sessions = prunedSessions;

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
