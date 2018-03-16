const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user.js')
const passwordHash = require('password-hash')
const zipcodes = require('zipcodes')

// create a user account
router.post('/', (req, res, next) => {
  const user = User({
    _id: new mongoose.Types.ObjectId(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    age: req.body.age,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    type: req.body.type,
    pay: req.body.pay,
    details: req.body.details,
    verification: req.body.verification,
    reports: req.body.report,
    password: passwordHash.generate(req.body.password)
  })
  user
    .save()
    .then(result => {
      res.status(201).json({
        message: 'handling POST request to /users',
        user: result
      })
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

// return a list of users
router.get('/', (req, res, next) => {
  User.find()
    .select('email zip _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            email: doc.email,
            zip: doc.zip,
            _id: doc._id,
            response: {
              type: 'GET',
              url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

// get a specific user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  User.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'No valid entry found.'})
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

// update a specific user
router.patch('/:userId', (req, res, next) => {
  const id = req.params.userId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  User.update({ _id: id }, { $set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

// delete a specific user
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

// find nearby users
router.get('/distance/:distance', (req, res, next) => {
  const distance = req.params.distance
  const nearbyZipcodes = zipcodes.radius(33602, distance)
  User.find({ 'zip': { $in: nearbyZipcodes} })
    .exec()
    .then(docs => {
      const response = {
        nearbyZipcodes: nearbyZipcodes,
        users: docs.map(doc => {
          return {
            name: doc.first_name,
            zip: doc.zip,
            email: doc.email
          }
        })
      }
      res.status(200).json(response)
    })
})

module.exports = router
