const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  pay: Number,
  details: String,
  date: { type: Date, default: Date.now },
  verification: String,
  report: { type: Number },
  password: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema)
