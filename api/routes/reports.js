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
  report
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

// show reports by user
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId
  Report.findOne({ 'user': id })
    .exec()
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

module.exports = router
