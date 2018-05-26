const express = require('express')
const router = express.Router()
const orderController = require('../controllers/users')
const userAuthenticate = require('../middleware/user-authentication')

// create a user account
router.post('/', orderController.user_create)

// authenticate a user
router.post('/authenticate', orderController.user_authenticate)

// return a list of users
router.get('/', orderController.user_list)

// get a specific user
router.get('/:userId', orderController.single_user)

// update a specific user
router.patch('/:userId', userAuthenticate, orderController.update_user)

// delete a specific user
router.delete('/:userId', orderController.delete_user)

// find nearby users
router.get('/distance/:distance', orderController.find_users)

module.exports = router
