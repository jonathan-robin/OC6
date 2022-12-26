const mongoose = require('mongoose'); // import mongoose for server and db
const express = require('express'); // import express for http routes
const bodyParser = require('body-parser'); // bodyParser for use json in body req

const app  = express(); 

// import routes 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// connect to mongoose and log OK or error
mongoose.connect('mongodb://127.0.0.1:27017/piquante', function(err) {
    if (err) throw err;
    else console.log('connexion mongoose OK');
})

// set the headers to accept X-origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.setHeader('Content-Type', 'application/json')
    next()
})

// parse in json the body for requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static('public')); // use it for public pictures

// import middleware
app.use('/api/auth', userRoutes); 
app.use('/api/sauces', sauceRoutes);

module.exports = app; // exports the app