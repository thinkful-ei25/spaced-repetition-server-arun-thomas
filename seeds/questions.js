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
  {
    _id: '000000000000000000000006',
    text: 'How long does it take to compress 1KB using Zippy?',
    answer: 3000,
  },
  {
    _id: '000000000000000000000007',
    text: 'How long does it take to send 1KB over a 1Gbps network?',
    answer: 10000,
  },
  {
    _id: '000000000000000000000008',
    text: 'How long does it take to randomly read 4KB from a SSD?',
    answer: 150000,
  },
  {
    _id: '000000000000000000000009',
    text: 'How long does it take to read 1MB sequentially from main memory?',
    answer: 250000,
  },
  {
    _id: '000000000000000000000010',
    text:
      'How long does it take a packet to complete a round trip within the same datacenter?',
    answer: 500000,
  },
  {
    _id: '000000000000000000000011',
    text: 'How long does it take to read 1MB sequentially from a SSD?',
    answer: 1000000,
  },
  {
    _id: '000000000000000000000012',
    text: 'How long does a HDD seek take?',
    answer: 10000000,
  },
  {
    _id: '000000000000000000000013',
    text: 'How long does it take to read 1MB sequentially from a HDD?',
    answer: 20000000,
  },
  {
    _id: '000000000000000000000014',
    text:
      'How long does it take a packet to complete a round trip from California to the Netherlands?',
    answer: 150000000,
  },
];

module.exports = questions;
