const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Rating = require('../models/rating.js')

// create rating
router.post('/', (req, res, next) => {
  const rating = Rating({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user,
    rating: req.body.rating
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

// get users average rating
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  Rating.findOne({ 'user': id })
    .exec()
    .then(doc => {
      console.log(doc);
      console.log(req.params.userId);
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'No valid entry found.'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

module.exports = router
