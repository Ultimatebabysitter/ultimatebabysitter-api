const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');

// creates a user account
router.post('/', (req, res, next) => {
  const user = User({
    _id: new mongoose.Types.ObjectId(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    age: req.body.age,
    location: req.body.location,
    type: req.body.type,
    pay: req.body.pay,
    details: req.body.details,
    verification: req.body.verification,
    report: req.body.report
  });
  user
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
  res.status(201).json({
    message: 'handling POST request to /users',
    user: user
  });
});

// returns a list of users
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET request to /users'
  });
});

// get a specific user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  res.status(200).json({
    message: 'request a specific user by id',
    id: id
  });
});

// update a specific user
router.patch('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling PATCH request to /users'
  });
});

// delete a specific user
router.delete('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling DELETE request to /users'
  });
});

module.exports = router;
