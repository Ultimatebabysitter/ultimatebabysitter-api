const express = require('express')
const router = express.Router()
const mongoose = require('mongoose') //
const User = require('../models/user') //
const zipcodes = require('zipcodes')
const userAuthenticate = require('../middleware/user-authentication')
const orderController = require('../controllers/users')

// create a user account
router.post('/', orderController.user_create)

// authenticate a user
router.post('/authenticate', orderController.user_authenticate)

// return a list of users
router.get('/', orderController.user_list)

// get a specific user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  User.findById(id)
    .exec()
    .then(doc => {
      if (doc.type === "babysitter") {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'no babysitter found'})
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
})

// update a specific user
router.patch('/:userId', userAuthenticate, (req, res, next) => {
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
router.delete('/:userId', userAuthenticate, (req, res, next) => {
  const id = req.params.userId
  if (req.userData._id === req.params.userId || req.userData.type === "admin") {
    User.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
  }
  res.status(500).json({error: "auth failed"})
})

// find nearby users
router.get('/distance/:distance', userAuthenticate, (req, res, next) => {
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
})

router.post('/testmail', (req, res, next) => {
  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PASSWORD
      }
    })
    const tempHash = randomstring.generate()
    const verificationURL = req.protocol + '://' + req.get('host') + 'users/validate/' + tempHash
    console.log(verificationURL)
    const mailOptions = {
      from: '"User mail" <foo@example.com>', // sender address
      to: 'bar@example.com, baz@example.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<h3>Verify your email</h3>' +
            '<p>Click this link to verify your account: ' + verificationURL + '</p>'
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      res.status(201).json({
        message: 'handling POST request to /users',
        message_sent: info.messageId,
        preview_url: nodemailer.getTestMessageUrl(info),
        user: "result"
      })
    })
  })
  // .then(
  //   res.status(201).json({
  //     message: 'handling POST request to /users',
  //     message_sent: info.messageId,
  //     preview_url: nodemailer.getTestMessageUrl(info),
  //     user: "result"
  //   })
  // )
  // .catch(err => {
  //   res.status(500).json({error: err})
  // })
})

module.exports = router
