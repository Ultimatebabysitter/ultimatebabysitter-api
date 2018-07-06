const User = require('../models/user.js')
const mongoose = require('mongoose')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const zipcodes = require('zipcodes')
const twilioHelper = require('../helpers/twilio');

// create a user
exports.create_user = (req, res, next) => {
  // if twilio is active send 4 digit code
  if (process.env.TWILIO_ACTIVE === 'true') {
    var randomNum = Math.floor(1000 + Math.random() * 9000);
    twilioHelper.send_sms_code(req.body.phone, randomNum)
    req.body.status = 'unverified'
    req.body.temp = randomNum
  }
  const user = User({
    ...req.body,
    _id: new mongoose.Types.ObjectId(),
    password: passwordHash.generate(req.body.password)
  })
  user
    .save()
    .then(result => {
      res.status(201).json({
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
    .lean()
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
          type: user[0].type,
          userId: user[0]._id
        }, process.env.JWT_KEY, {expiresIn: '3h'})
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
    .select('email zip type _id')
    .lean()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            email: doc.email,
            zip: doc.zip,
            type: doc.type,
            _id: doc._id,
            url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + doc._id
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
    .lean()
    .exec()
    .then(user => {
      // restrict data if not admin
      if (req.userData.type != 'admin') {
        // only return babysitter data
        if (user.type === 'babysitter') {
          const response = {
            first_name: user.first_name,
            age: user.age,
            city: user.city,
            pay: user.pay,
            details: user.details
          }
          res.status(200).json(response)
        } else {
          res.status(404).json({message: 'no babysitter found'})
        }
      } else {
        res.status(200).json(user)
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
  const id = req.userData.userId
  User.find({
    'zip': { $in: nearbyZipcodes },
    _id: {$ne: id} })
    .where('type', 'babysitter')
    .lean()
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
