'use strict';

// Custom 404 Not Found route handler
const error404 = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

// Custom Error Handler
// eslint-disable-next-line no-unused-vars
const error500 = (err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  error404,
  error500,
};
