const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  location: String,
  type: String,
  pay: Number,
  details: String,
  date: { type: Date, default: Date.now },
  verification: String,
  report: Boolean
});

module.exports = mongoose.model('User', userSchema);
