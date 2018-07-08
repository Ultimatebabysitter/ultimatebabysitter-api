const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: { unique: true },
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  phone: { type: String },
  age: { type: Number, min: 18, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  image_url: String,
  type: { type: String, required: true, enum: ['parent', 'babysitter', 'admin'] },
  pay: Number,
  details: String,
  date: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  verification: String,
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  password: { type: String, required: true },
  status: { type: String, default: 'unverified' },
  temp: { type: String }
})

module.exports = mongoose.model('User', userSchema)
