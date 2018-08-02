const Rating = require('../models/rating.js')
const ratingsDatabase = require('../database/ratings')
const mongoose = require('mongoose')
const _ = require('lodash')

// create a rating
exports.create_rating = (req, res, next) => {
  const id = req.userData.userId
  const rating = Rating({
    ...req.body,
    _id: new mongoose.Types.ObjectId()
  })

  ratingsDatabase.is_user_rated(req.body.user, id)
    .then(ratings => {
      // check if logged user has rated target babysitter
      if (!Array.isArray(ratings) || !ratings.length) {
        return rating.save()
      } else {
        res.status(200).json({message: 'cannot rate the same user more than once'})
      }
    })
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// get average rating of a user
exports.get_average_rating = (req, res, next) => {
  const targetId = req.params.userId
  ratingsDatabase.get_ratings_by_user(targetId)
    .then(ratings => {
      let ratingsCount = ratings.length
      var ratingsArray = _.times(ratingsCount, function(i) {
        return ratings[i].rating
      })
      const response = {
        count: ratingsCount,
        average: _.meanBy(ratingsArray),
        ratings: ratings.map(rating => {
          return {
            ...rating
          }
        })
      }
      if (ratings) {
        res.status(200).json(response)
      } else {
        res.status(200).json({message: 'No ratings found'})
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// delete a rating
exports.delete_rating = (req, res, next) => {
  const id = req.params.ratingId
  const currentUserId = req.userData.userId
  ratingsDatabase.delete_rating(id, currentUserId)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}
