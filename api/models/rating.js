const mongoose = require('mongoose')
const ratingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporting_user: { type: String, required: true }
})

module.exports = mongoose.model('Rating', ratingSchema)
