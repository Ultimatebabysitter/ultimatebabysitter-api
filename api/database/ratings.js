const Rating = require('../models/rating.js')

// get ratings by user id
exports.get_ratings_by_user = (id) => {
  return Rating.find({ 'user': id }).lean().exec()
}

// verify that current user hasn't already rated target user
exports.is_user_rated = (targetUserId, currentUserId) => {
  return Rating.find({ 'user': targetUserId, 'reporting_user': currentUserId }).lean().exec()
}

// delete rating
exports.delete_rating = (id, currentUserId) => {
  return Rating.remove({ _id: id, 'reporting_user': currentUserId }).exec()
}
