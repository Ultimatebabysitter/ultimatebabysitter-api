const express = require('express')
const router = express.Router()
const orderController = require('../controllers/users')
const userAuthenticate = require('../middleware/user-authentication')
const permissions = require('../middleware/permissions')

// create a user
router.post('/', orderController.create_user)

// get a user
router.get('/:userId', orderController.single_user)

// update a user
router.patch('/:userId', userAuthenticate, permissions, orderController.update_user)

// delete a user
router.delete('/:userId', userAuthenticate, permissions, orderController.delete_user)

// authenticate a user
router.post('/authenticate', orderController.authenticate_user)

// get a list of users
router.get('/', orderController.list_users)

// get users by distance in relation to authenticated user
router.get('/distance/:distance', userAuthenticate, orderController.find_users)

module.exports = router
