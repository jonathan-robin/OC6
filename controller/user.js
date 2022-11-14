
const USER = require('../models/user'); 

exports.signup = (req, res, next) => { 
    console.log(req);
    console.log(req.body);
    let pass = req.body.password; 
    let email = req.body.email; 

    let user = {email, pass};
    console.log(user);

    // const user = new user({ email, pass});
    // user.save()
    // .then(res => res);

}