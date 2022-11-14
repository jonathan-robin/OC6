
const bcrypt = require('bcrypt');
const User = require('../models/user');


exports.signup = async (req, res, next) => { 
    console.log(req);
    console.log(req.body);
    let passTmp = req.body.password; 

    let salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(passTmp, salt);

    let email = req.body.email; 


    let user = new User({email, password});

    user.save()
    .then(data => res.status(201).send(data))
    .catch(err => console.log(err));
}