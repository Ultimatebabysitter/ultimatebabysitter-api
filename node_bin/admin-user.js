const User = require('../api/models/user.js')
const mongoose = require('mongoose')
const id = process.argv[2]

// connect to mongodb
mongoose.connect('mongodb://localhost/ultimatebabysitter')

// update the user to admin
User.findByIdAndUpdate(id, { $set: { type: 'admin' } }, function (err, result) {
  if (err) {
    console.log(err)
  }
  console.log('Result: ' + result)
})
