const User = require('../models/user.js')

// create a user
exports.create_user = (userData) => {
  return userData.save()
}

// authenticate a user
exports.find_user_by_email = (email) => {
  return User.find({email: email}).lean().exec()
}

// get a user
exports.get_user = (id) => {
  return User.findById(id).lean().exec()
}

// get all users
exports.get_all_users = () => {
  return User.find().sort({last_login: 'desc'}).lean().exec()
}

// update a user
exports.update_user = (id, userData) => {
  return User.update({ _id: id }, { $set: userData })
}

// delete user
exports.delete_user = (id) => {
  return User.remove({ _id: id })
}

// get users by range
exports.users_by_distance = (id, nearbyZipcodes) => {
  return User.find({ 'zip': { $in: nearbyZipcodes }, _id: { $ne: id }, type: 'babysitter' })
    .sort({last_login: 'asc'})
    .lean()
    .exec()
}
