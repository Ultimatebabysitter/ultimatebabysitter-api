const express = require('express')
const router = express.Router()
const ratingsController = require('../controllers/ratings')
const userAuthenticate = require('../middleware/user-authentication')
const permissions = require('../middleware/permissions')
const sanitizeRating = require('../middleware/sanitize-rating')
const sanitizeParams = require('../middleware/sanitize-params')

// create a rating
router.post('/', sanitizeRating, userAuthenticate, ratingsController.create_rating)

// get a users average rating
router.get('/:userId', sanitizeParams, ratingsController.get_average_rating)

// delete a rating
router.delete('/:ratingId', sanitizeParams, userAuthenticate, ratingsController.delete_rating)

module.exports = router
