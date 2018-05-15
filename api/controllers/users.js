const User = require('../models/user.js')
const mongoose = require('mongoose')
const randomstring = require('randomstring')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')

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

exports.user_authenticate = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({message: 'auth failed'})
      }
      console.log(user[0])
      var hashedPassword = user[0].password

      if (passwordHash.verify(req.body.password, hashedPassword)) {
        const token = jwt.sign({
          email: user[0].email,
          zip: user[0].zip,
          userId: user[0]._id
        }, process.env.JWT_KEY, {expiresIn: '1h'})
        return res.status(201).json({
          message: 'auth worked',
          token: token
        })
      }
      res.status(401).json({message: 'auth failed'})
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
