const User = require('../models/user.js')
const mongoose = require('mongoose')
const randomstring = require('randomstring')
const passwordHash = require('password-hash')

exports.user_create = (req, res, next) => {
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
}

exports.user_validate = (req, res, next) => {
  const temp = req.params.temp
  User.find({'temp': temp})
    .exec()
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}
