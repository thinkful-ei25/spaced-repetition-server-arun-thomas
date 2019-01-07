'use strict';

const mongoose = require('mongoose');

const { MONGODB_OPTIONS } = require('./config');

mongoose.Promise = global.Promise;

const { DATABASE_URL } = require('./config');

/* eslint-disable no-console */
function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url, MONGODB_OPTIONS)
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}
/* eslint-enable no-console */

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};
