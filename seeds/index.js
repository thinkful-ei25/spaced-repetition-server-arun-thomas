'use strict';

const mongoose = require('mongoose');

const Question = require('../models/question');
const questions = require('./questions');
const { DATABASE_URL, MONGODB_OPTIONS } = require('../config');

/* eslint-disable no-console */
if (require.main === module) {
  console.log(`Connecting to mongodb: ${DATABASE_URL}`);

  mongoose
    .connect(DATABASE_URL, MONGODB_OPTIONS)
    .then(() => {
      console.info('Deleting existing data');
      return Question.deleteMany();
    })
    .then(()=> {
      console.info('Seeding database');
      return Question.insertMany(questions);
    })
    .then((results) => {
      console.log('Inserted', results);
      console.info('Disconnecting...');
      return mongoose.disconnect();
    })
    .catch(err=> {
      console.err(err);
      return mongoose.disconnect();
    });
}
