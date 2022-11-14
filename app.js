const mongoose = require('mongoose'); 
const express = require('express');
const bodyParser = require('body-parser');


const app  = express(); 

const userRoutes = require('./routes/user');

mongoose.connect('mongodb://127.0.0.1:27017/piquante', function(err) {
    if (err) { throw err; }
    else console.log('connexion mongoose OK');
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.setHeader('Content-Type', 'application/json')
    next()
})

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

module.exports = app;