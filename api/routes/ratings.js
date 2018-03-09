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

// get a users average rating
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  Rating.find({ 'user': id })
    .exec()
    .then(docs => {
      var averageStorage = 0;
      for (i = 0; i < docs.length; i++) {
        ratingTrail = docs[i].rating;
        averageStorage = ratingTrail + averageStorage;
      }
      userRatingAverage = averageStorage / docs.length;
      const response = {
        count: docs.length,
        userRatingAverage: userRatingAverage,
        ratings: docs.map(doc => {
          return {
            id: doc._id,
            user: doc.user,
            rating: doc.rating
          }
        })
      }
      if (docs) {
        console.log(response);
        res.status(200).json(response)
      } else {
        res.status(404).json({message: 'No ratings found for user.'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

module.exports = router
