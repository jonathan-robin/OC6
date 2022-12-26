
const bcrypt = require('bcrypt'); // to decrypt hashed pass
const jwt = require('jsonwebtoken'); // to hash pass
const User = require('../models/user');

exports.signup = async (req, res, next) => { 
    let password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)); // hash the password with a bcrypt genSalt
    let user = new User({email:req.body.email, password}); // create new user
    // then save it, if no error send back 201 status code, catch if err 11000 theres already email in use : else throw err
    user.save().then(data =>res.status(201).send(data)).catch((err) => err.code === 11000 ? res.status(500).send('Email already in use') : res.status(500).send({err}));// 
}

exports.login = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email}); // try to find the user in db
    user ? await bcrypt.compare(req.body.password, user.password) ? res.status(200).json({userId: user._id, token: jwt.sign({ userId: user._id}, process.env.JWTOKEN, {expiresIn: '24hr'})}) : res.status(400).json('Invalid pass') 
    :  res.status(401).json({ error: 'User doesn\'t exist' });
}