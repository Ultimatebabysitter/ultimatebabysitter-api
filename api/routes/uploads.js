const express = require('express')
const router = express.Router()
const uploadsController = require('../controllers/uploads')
const userAuthenticate = require('../middleware/user-authentication')

// Get signed url
router.get('/', userAuthenticate, uploadsController.get_signed_url)

module.exports = router
