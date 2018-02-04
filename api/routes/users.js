const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling GET request to /users'
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'handling POST request to /users'
  });
});

router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  res.status(200).json({
    message: 'request a specific user by id',
    id: id
  });
});

router.patch('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling PATCH request to /users'
  });
});

router.delete('/', (req, res, next) => {
  res.status(200).json({
    message: 'handling DELETE request to /users'
  });
});

module.exports = router;
