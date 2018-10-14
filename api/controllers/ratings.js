"use strict"
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

  ratingsDatabase.isUserRated(req.body.user, id)
    .then(ratings => {
      console.log(ratings);
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

exports.createRating = async (req, res, next) => {
  const id = req.userData.userId
  const rating = Rating({
    ...req.body,
    _id: new mongoose.Types.ObjectId()
  })
  try {
    const rated = await ratingsDatabase.isUserRated(req.body.user, id)
    console.log(rated);
    // check if logged user has rated target babysitter
    // if (!Array.isArray(rated) || !ratings.length) {
    //   console.log('save');
    //   return rating.save()
    // } else {
    //   console.log('cant save');
    //   res.status(200).json({message: 'cannot rate the same user more than once'})
    // }
    console.log('no if else');
    res.status(201).json(rated)
  } catch (err) {
    res.status(500).json({error: err})
  }
}

// get average rating of a user
exports.averageRating = async (req, res, next) => {
  const targetId = req.params.userId
  try {
    const ratings = await ratingsDatabase.userRatings(targetId)
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
  } catch (err) {
    res.status(500).json({error: err})
  }
}

// delete a rating
exports.deleteRating = async (req, res, next) => {
  const id = req.params.ratingId
  const currentUserId = req.userData.userId
  try {
    const result = await ratingsDatabase.deleteRating(id, currentUserId)
    res.status(200).json(result)
  }
  catch (err) {
    res.status(500).json({error: err})
  }
}
