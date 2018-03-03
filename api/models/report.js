const mongoose = require('mongoose')
const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String
})

module.exports = mongoose.model('Report', reportSchema)
