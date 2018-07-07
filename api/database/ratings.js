const Rating = require('../models/rating.js')

// get ratings by user id
exports.get_ratings_by_user = (id) => {
  return Rating.find({ 'user': id }).lean().exec()
}

// module.exports = {
//   get_ratings_by_user: (id) => {
//     console.log("id: ", id);
//     Rating.find({ 'user': id })
//       .lean()
//       .exec()
//       .then(ratings => {
//         const response = {
//           count: ratings.length,
//           ratings: ratings.map(rating => {
//             return {
//               id: rating._id,
//               user: rating.user,
//               rating: rating.rating
//             }
//           })
//         }
//         if (ratings) {
//           // res.send(ratings)
//           return response
//         } else {
//           // res.send("No ratings found.")
//           return "No ratings found for the user."
//         }
//       })
//       .catch(err => {
//         return err
//       })
//   }
// }

// User.findByIdAndUpdate(id, { $set: { type: 'admin' } }, function (err, result) {
//   if (err) {
//     console.log(err)
//   }
//   console.log('Result: ' + result)
// })

// Rating.find({ 'user': id })
//   .lean()
//   .exec()
//   .then(ratings => {
//     const response = {
//       count: ratings.length,
//       ratings: ratings.map(rating => {
//         return {
//           id: rating._id,
//           user: rating.user,
//           rating: rating.rating
//         }
//       })
//     }
//     if (ratings) {
//       return response
//     } else {
//       return "No ratings found for the user."
//     }
//   })
//   .catch(err => {
//     return err
//   })
