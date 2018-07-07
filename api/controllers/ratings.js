const Rating = require('../models/rating.js')
const ratingsDatabase = require('../database/ratings');
const mongoose = require('mongoose')

// create a rating
exports.create_rating = (req, res, next) => {
  const rating = Rating({
    ...req.body,
    _id: new mongoose.Types.ObjectId()
  })
  rating
    .save()
    .then(result => {
      res.status(201).json({
        rating: result
      })
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
}

// get average rating of a user
exports.get_average_rating = (req, res, next) => {
  const id = req.params.userId
  ratingsDatabase.get_ratings_by_user(id)
    .then(ratings => {
      var averageStorage = 0
      let ratingsCount = ratings.length
      console.log(ratingsCount);
      for (let i = 0; i < ratingsCount; i++) {
        var averageStorage = ratings[i].rating + averageStorage
        console.log(averageStorage);
      }
      let userRatingAverage = averageStorage / ratingsCount
      const response = {
        count: ratingsCount,
        average: userRatingAverage,
        ratings: ratings.map(rating => {
          return {
            id: rating._id,
            user: rating.user,
            rating: rating.rating,
            reporting_user: rating.reporting_user
          }
        })
      }
      if (ratings) {
        res.send(response)
      } else {
        res.send("No ratings found.")
      }
    })
    .catch(err => {
      res.send(err)
    })
  //   var averageStorage = 0
  //   let i
  //   let ratingTrail
  //   let userRatingAverage
  //   for (i = 0; i < docs.length; i++) {
  //     ratingTrail = docs[i].rating
  //     averageStorage = ratingTrail + averageStorage
  //   }
  //   userRatingAverage = averageStorage / docs.length
  //   const response = {
  //     count: docs.length,
  //     userRatingAverage: userRatingAverage,
  //     ratings: docs.map(doc => {
  //       return {
  //         id: doc._id,
  //         user: doc.user,
  //         rating: doc.rating
  //       }
  //     })
  //   }
  //   if (docs) {
  //     res.status(200).json(response)
  //   } else {
  //     res.status(404).json({message: 'No ratings found for user.'})
  //   }
  // })
  // .catch(err => {
  //   res.status(500).json({error: err})
  // })
    // .then(ratings => {
    //   const response = {
    //     count: ratings.length,
    //     ratings: ratings.map(rating => {
    //       return {
    //         id: rating._id,
    //         user: rating.user,
    //         rating: rating.rating
    //       }
    //     })
    //   }
    //   if (ratings) {
    //     res.send(ratings)
    //   } else {
    //     res.send("No ratings found.")
    //   }
    // })
    // .catch(err => {
    //   res.send(err)
    // })
}

// // authenticate a user
// exports.authenticate_user = (req, res, next) => {
//   User.find({email: req.body.email})
//     .lean()
//     .exec()
//     .then(user => {
//       if (user.length < 1) {
//         return res.status(401).json({message: 'auth failed'})
//       }
//       var hashedPassword = user[0].password
//       if (passwordHash.verify(req.body.password, hashedPassword)) {
//         const token = jwt.sign({
//           email: user[0].email,
//           zip: user[0].zip,
//           type: user[0].type,
//           userId: user[0]._id
//         }, process.env.JWT_KEY, {expiresIn: '3h'})
//         return res.status(201).json({
//           message: 'auth worked',
//           token: token
//         })
//       }
//       res.status(401).json({message: 'auth failed'})
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
//
// // verify a user
// exports.verify_user = (req, res, next) => {
//   userId = req.params.userId
//   authCode = req.params.authCode
//
//   User.findById(userId)
//     .select('_id temp')
//     .lean()
//     .exec()
//     .then(user => {
//       if (user.temp === authCode) {
//         // update user status
//         User.findByIdAndUpdate(userId, { $set: { status: 'verified' } }, function (err, result) {
//           if (err) {
//             console.log(err)
//           }
//           console.log('Result: ' + result)
//         })
//         res.status(200).json({
//           response: 'user validated'
//         })
//       } else {
//         res.status(400).json({
//           response: 'user not validated'
//         })
//       }
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
//
// // get a list of users
// exports.list_users = (req, res, next) => {
//   User.find()
//     .select('email zip type _id')
//     .lean()
//     .exec()
//     .then(docs => {
//       const response = {
//         count: docs.length,
//         users: docs.map(doc => {
//           return {
//             email: doc.email,
//             zip: doc.zip,
//             type: doc.type,
//             _id: doc._id,
//             url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + doc._id
//           }
//         })
//       }
//       res.status(200).json(response)
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
//
// // get a user
// exports.single_user = (req, res, next) => {
//   const id = req.params.userId
//   User.findById(id)
//     .lean()
//     .exec()
//     .then(user => {
//       // restrict data if not admin
//       if (req.userData.type != 'admin') {
//         // only return babysitter data
//         if (user.type === 'babysitter') {
//           const response = {
//             first_name: user.first_name,
//             age: user.age,
//             city: user.city,
//             pay: user.pay,
//             details: user.details
//           }
//           res.status(200).json(response)
//         } else {
//           res.status(404).json({message: 'no babysitter found'})
//         }
//       } else {
//         res.status(200).json(user)
//       }
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
//
// // update a user
// exports.update_user = (req, res, next) => {
//   const id = req.params.userId
//   const updateOps = {}
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value
//   }
//   User.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       res.status(200).json(result)
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
//
// // delete a user
// exports.delete_user = (req, res, next) => {
//   const id = req.params.userId
//   User.remove({ _id: id })
//     .exec()
//     .then(result => {
//       res.status(200).json(result)
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
//
// // get users by distance in relation to authenticated user
// exports.find_users = (req, res, next) => {
//   const distance = req.params.distance
//   const nearbyZipcodes = zipcodes.radius(req.userData.zip, distance)
//   const id = req.userData.userId
//   User.find({
//     'zip': { $in: nearbyZipcodes },
//     _id: {$ne: id} })
//     .where('type', 'babysitter')
//     .lean()
//     .exec()
//     .then(docs => {
//       const response = {
//         numberOfUsers: docs.length,
//         users: docs.map(doc => {
//           return {
//             name: doc.first_name,
//             zip: doc.zip,
//             email: doc.email
//           }
//         }),
//         nearbyZipcodes: nearbyZipcodes
//       }
//       res.status(200).json(response)
//     })
//     .catch(err => {
//       res.status(500).json({error: err})
//     })
// }
