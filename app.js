const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const http = require('http')

// routes
const userRoutes = require('./api/routes/users.js')
const reportRoutes = require('./api/routes/reports.js')
const ratingRoutes = require('./api/routes/ratings.js')

// connect to mongodb
mongoose.connect(process.env.MONGODB_HOST)

// misc
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// routes
app.use('/users', userRoutes)
app.use('/reports', reportRoutes)
app.use('/ratings', ratingRoutes)

// error catching
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})


// server
const port = process.env.PORT || 3000
const server = http.createServer(app)
if (!module.parent) {
  server.listen(port)
}

module.exports = app
