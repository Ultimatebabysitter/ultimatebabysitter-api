const express = require('express');
const router = express.Router();

// creates a user account
router.post('/', (req, res, next) => {
  const user = {
    name: req.body.name,
    age: req.body.age,
    location: req.body.location,
    type: req.body.type,
    pay: req.body.pay,
    details: req.body.details
  };
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
