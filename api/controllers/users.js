const User = require('../models/user.js')
const mongoose = require('mongoose')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const zipcodes = require('zipcodes')
const twilioHelper = require('../helpers/twilio')
const usersDatabase = require('../database/users')
const _ = require('lodash')

// create a user
exports.create_user = (req, res, next) => {
  // if twilio is active send 4 digit code
  if (process.env.TWILIO_ACTIVE === 'true') {
    var randomNum = Math.floor(1000 + Math.random() * 9000)
    twilioHelper.send_sms_code(req.body.phone, randomNum)
    req.body.temp = randomNum
  }
  const user = User({
    ...req.body,
    _id: new mongoose.Types.ObjectId(),
    password: passwordHash.generate(req.body.password)
  })
  usersDatabase.create_user(user)
    .then(result => {
      const response = {
        id: result._id,
        first_name: result.first_name,
        age: result.age,
        city: result.city,
        pay: result.pay,
        details: result.details
      }
      res.status(201).json(response)
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// authenticate a user
exports.authenticate_user = (req, res, next) => {
  var currentDate = new Date()
  usersDatabase.find_user_by_email(req.body.email)
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
        User.findByIdAndUpdate(user[0]._id, { $set: { last_login: currentDate } }, function (err, result) {
          if (err) {
            res.send(err)
          }
        })
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

// verify a user
exports.verify_user = (req, res, next) => {
  var userId = req.params.userId
  var authCode = req.params.authCode
  usersDatabase.get_user(userId)
    .then(user => {
      if (user.temp === authCode) {
        // update user status
        User.findByIdAndUpdate(userId, { $set: { status: 'verified' } }, function (err, result) {
          if (err) {
            console.log(err)
          }
          console.log('Result: ' + result)
        })
        res.status(200).json({
          response: 'user validated'
        })
      } else {
        res.status(400).json({
          response: 'user not validated'
        })
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// get a list of users
exports.list_users = (req, res, next) => {
  usersDatabase.get_all_users()
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
  usersDatabase.get_user(id)
    .then(user => {
      // restrict data if not admin
      if (req.userData.type !== 'admin') {
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
  const updateData = {}
  _.times(req.body.length, function(i) {
    updateData[req.body[i]['propName']] = req.body[i]['value']
  })
  usersDatabase.update_user(id, updateData)
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
  usersDatabase.delete_user(id)
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
  usersDatabase.users_by_distance(id, nearbyZipcodes)
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

// send mail
exports.send_mail = (req, res, next) => {
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: req.body.email,
    from: req.userData.email,
    subject: req.body.subject,
    html: req.body.html,
  };
  sgMail
  .send(msg)
  .then(response => {
    res.status(201).json(response)
  })
  .catch(error => {
    res.status(500).json(error)
  });
}
