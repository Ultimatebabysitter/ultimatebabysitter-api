const User = require('../models/user.js')
const mongoose = require('mongoose')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const zipcodes = require('zipcodes')

// create a user
exports.create_user = (req, res, next) => {
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

// authenticate a user
exports.authenticate_user = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({message: 'auth failed'})
      }
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

// get a list of users
exports.list_users = (req, res, next) => {
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
}

// get a user
exports.single_user = (req, res, next) => {
  const id = req.params.userId
  User.findById(id)
    .exec()
    .then(doc => {
      if (doc.type === 'babysitter') {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'no babysitter found'})
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// update a user
exports.update_user = (req, res, next) => {
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
}

// delete a user
exports.delete_user = (req, res, next) => {
  const id = req.params.userId
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// get users by distance in relation to authenticated user
exports.find_users = (req, res, next) => {
  const distance = req.params.distance
  const nearbyZipcodes = zipcodes.radius(req.userData.zip, distance)
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
}
