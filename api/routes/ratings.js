const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Rating = require('../models/rating.js')

// create rating
router.post('/', (req, res, next) => {
  const rating = Rating({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user,
    rating: req.body.comment
  })
  rating
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'handling POST request to /rating',
        rating: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})
