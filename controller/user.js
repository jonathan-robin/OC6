
const bcrypt = require('bcrypt'); // to decrypt hashed pass
const jwt = require('jsonwebtoken'); // to hash pass
const User = require('../models/user'); // Import the user model

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
    .catch((err) => { // catch if err 11000 theres already email in use : else throw err
        return err.code === 11000 ? res.status(500).send('Email already in use') : res.status(500).send(err)
    });
}

exports.login = async (req, res, next) => {
    // get the request payload
    let email = req.body.email; 
    let password = req.body.password; 

    const user = await User.findOne({ email }); // try to find the user in db
    if (user){ 
        // if so check user pass with hashed pass stored in db
        const validPass = await bcrypt.compare(password, user.password); 
        validPass ? res.status(200).json({
            userId: user._id, 
            token: jwt.sign({ userId: user._id}, process.env.JWTOKEN, {expiresIn: '24hr'}) // sign the token and validate it for 24hr
        }) : res.status(400).json({ error: 'Invalid pass'});
    }else{
        res.status(401).json({ error: 'User doesn\'t exist' });
    }
}