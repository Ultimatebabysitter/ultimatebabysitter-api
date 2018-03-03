const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  age: { type: Number, min: 18, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['Parent', 'Babysitter'] },
  pay: Number,
  details: String,
  date: { type: Date, default: Date.now },
  verification: String,
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  password: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema)
