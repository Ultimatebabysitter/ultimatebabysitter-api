const User = require('../models/user.js')
const mongoose = require('mongoose')
const randomstring = require('randomstring')
const passwordHash = require('password-hash')
const nodemailer = require('nodemailer')

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
    password: passwordHash.generate(req.body.password),
    status: 'pending',
    temp: randomstring.generate()
  })
  user
    .save()
    .then(result => {
      if (result) {
        console.log(result);
        nodemailer.createTestAccount((err, account) => {
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: process.env.ETHEREAL_EMAIL,
              pass: process.env.ETHEREAL_PASSWORD
            }
          });
          const verificationURL = req.protocol + '://' + req.get('host') + '/users/validate/' + result.temp
          const mailOptions = {
            from: '"User mail" <foo@example.com>',
            to: result.email,
            subject: 'UltimateBabysitter Account Verification',
            html: '<h3>Verify your email</h3>' +
                  '<p>Click this link to verify your account: <a href="' + verificationURL + '">' + verificationURL + '</a></p>'
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return res.status(201).json({
              message: 'handling POST request to /users',
              message_sent: info.messageId,
              preview_url: nodemailer.getTestMessageUrl(info),
              user: result
            })
          })
        })

      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}
