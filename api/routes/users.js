const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const userAuthenticate = require('../middleware/user-authentication')
const permissions = require('../middleware/permissions')
const userTypeCheck = require('../middleware/user-type-check')
const sanitizeUser = require('../middleware/sanitize-user')

// create a user
router.post('/', sanitizeUser, userTypeCheck, usersController.create_user)

// get a user
router.get('/:userId', userAuthenticate, usersController.single_user)

// update a user
router.patch('/:userId', userAuthenticate, permissions, usersController.update_user)

// delete a user
router.delete('/:userId', userAuthenticate, permissions, usersController.delete_user)

// authenticate a user
router.post('/authenticate', usersController.authenticate_user)

// verify a user
router.post('/verify/:userId/:authCode', usersController.verify_user)

// get a list of users
router.get('/', usersController.list_users)

// get users by distance in relation to authenticated user
router.get('/distance/:distance', userAuthenticate, usersController.find_users)

module.exports = router
