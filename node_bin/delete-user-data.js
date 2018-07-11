const User = require('../api/models/user.js')
const mongoose = require('mongoose')
const faker = require('faker')
// const count = process.argv[2]

// connect to mongodb
mongoose.connect('mongodb://localhost/ultimatebabysitter')

// update the user to admin
User.deleteMany( {type: { $nin: 'admin' }}, function (err, result) {
  if (err) {
    console.log(err)
  }
  console.log('Result: ' + result)
})
