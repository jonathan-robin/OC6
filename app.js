const mongoose = require('mongoose'); 
const express = require('express');


const app  = express(); 

mongoose.connect('mongodb://127.0.0.1:27017/blog', function(err) {
    if (err) { throw err; }
    else console.log('connexion mongoose OK');
})

module.exports = app;