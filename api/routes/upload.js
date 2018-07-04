const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/upload')
const userAuthenticate = require('../middleware/user-authentication')

// Get signed url
router.get('/', userAuthenticate, uploadController.get_signed_url)

module.exports = router
