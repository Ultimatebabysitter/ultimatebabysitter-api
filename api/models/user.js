const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: String,
  last_name: String,
  email: { type:String, required: true, index: { unique: true } },
  age: Number,
  location: String,
  type: String,
  pay: Number,
  details: String,
  date: { type: Date, default: Date.now },
  verification: String,
  report: Boolean,
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
