/* eslint-disable max-len */

'use strict';

const questions = [
  {
    _id: '000000000000000000000001',
    text: 'How long does a L1 cache reference take to complete?',
    answer: 0.5,
  },
  {
    _id: '000000000000000000000002',
    text: 'How much time does a branch mispredict cost?',
    answer: 5,
  },
  {
    _id: '000000000000000000000003',
    text: 'How long does a L2 cache reference take to complete?',
    answer: 7,
  },
  {
    _id: '000000000000000000000004',
    text: 'How long does it take to (un)lock a mutex?',
    answer: 25,
  },
  {
    _id: '000000000000000000000005',
    text: 'How long does it take to reference main memory?',
    answer: 100,
  },
];

module.exports = questions;
