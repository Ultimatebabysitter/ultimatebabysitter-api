const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Report = require('../models/report.js')

// creates a report
router.post('/', (req, res, next) => {
  const report = Report({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user,
    comment: req.body.comment
  })
  user
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'handling POST request to /reports',
        report: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

module.exports = router
