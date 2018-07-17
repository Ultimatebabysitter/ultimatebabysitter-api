const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const userAuthenticate = require('../middleware/user-authentication')
const permissions = require('../middleware/permissions')
const userTypeCheck = require('../middleware/user-type-check')
const sanitizeUser = require('../middleware/sanitize-user')
const sanitizeParams = require('../middleware/sanitize-params')

// message a user
router.post('/message/user', usersController.message_user)

// create a user
router.post('/', sanitizeUser, userTypeCheck, usersController.create_user)

// get a user
router.get('/:userId', sanitizeParams, userAuthenticate, usersController.single_user)

// update a user
router.patch('/:userId', sanitizeParams, userAuthenticate, permissions, usersController.update_user)

// delete a user
router.delete('/:userId', sanitizeParams, userAuthenticate, permissions, usersController.delete_user)

// authenticate a user
router.post('/authenticate', usersController.authenticate_user)

// verify a user
router.post('/verify/:userId/:authCode', sanitizeParams, usersController.verify_user)

// get a list of users
router.get('/', usersController.list_users)

// get users by distance in relation to authenticated user
router.get('/distance/:distance', sanitizeParams, userAuthenticate, usersController.find_users)

module.exports = router
