const express = require('express');
const app = express();

const userRoutes = require('./api/routes/users.js')

app.use('/users', userRoutes);

module.exports = app;
