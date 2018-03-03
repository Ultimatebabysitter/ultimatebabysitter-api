const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user.js')
const passwordHash = require('password-hash')

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
    report: req.body.report,
    password: passwordHash.generate(req.body.password)
  })
  user
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'handling POST request to /users',
        user: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

// returns a list of users
router.get('/', (req, res, next) => {
  User.find()
    .select('email location _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

// get a specific user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  User.findById(id)
    .exec()
    .then(doc => {
      console.log(doc)
      // @todo this never falls to the 404
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
      console.log(result)
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

module.exports = router
