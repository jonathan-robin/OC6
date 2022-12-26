
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = async (req, res, next) => { 
    // get the request payload
    let passTmp = req.body.password; 
    let email = req.body.email; 

    // hash pass
    let salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(passTmp, salt);
    
    let user = new User({email, password}); // create new user
    user.save() // then save it 
    .then(data => res.status(201).send(data)) // if no error send back 201 status code
    .catch((err) => { // catch err if code: 11000 -> it means email is dupplicate 
        return err.code === 11000 ? res.status(500).send('Email is already in use.') : res.status(500).send('Impossible de créer le compte.')
    });
}

exports.login = async (req, res, next) => {
    // get the request payload
    let email = req.body.email; 
    let password = req.body.password; 

    const user = await User.findOne({ email }); 
    if (user){ 
        // check user pass with hashed pass stored in db
        const validPass = await bcrypt.compare(password, user.password); 
        validPass ? res.status(200).json({
            userId: user._id, 
            token: jwt.sign({ userId: user._id}, process.env.JWTOKEN, {expiresIn: '24hr'})
        }) : res.status(400).json({ error: 'Invalid pass'});
    }else{
        res.status(401).json({ error: 'User doesn\'t exist' });
    }
}