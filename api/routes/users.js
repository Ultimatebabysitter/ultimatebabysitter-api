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

// authenticate a user
router.post('/authenticate', (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({message: 'auth failed'})
      }
      var hashedPassword = user[0].password;
      if (passwordHash.verify(req.body.password, hashedPassword)) {
        return res.status(200).json({message: 'auth worked'})
      }
      res.status(401).json({message: 'auth failed'})
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
  User.update({ _id: id }, { $set: updateOps })
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
  // @todo change hardcoded zip to be logged in users zip
  const nearbyZipcodes = zipcodes.radius(33602, distance)
  User.find({ 'zip': { $in: nearbyZipcodes} })
    .exec()
    .then(docs => {
      const response = {
        numberOfUsers: docs.length,
        users: docs.map(doc => {
          return {
            name: doc.first_name,
            zip: doc.zip,
            email: doc.email
          }
        }),
        nearbyZipcodes: nearbyZipcodes
      }
      res.status(200).json(response)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

module.exports = router
