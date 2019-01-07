'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const { error404, error500 } = require('./error-middleware');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(express.json());

app.use('/api', routes);
app.use(error404);
app.use(error500);

/* eslint-disable no-console */
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
}
/* eslint-disable no-console */

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
