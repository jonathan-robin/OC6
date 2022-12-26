const Sauce = require('../models/sauce') // use sauce models 
const fs = require('fs'); // use fs in order to create file

exports.getSauces = (req, res, next) => Sauce.find().then(sauces => res.status(200).json(sauces)).catch(error => res.status(400).json({ error: error })) // get all the sauces
exports.getSauce = (req, res, next) => Sauce.findOne({ _id: req.params.id }).then(sauce => res.status(200).json(sauce)).catch(error => res.status(404).json({ error: error })) // Get one specific sauce
// Create a sauce
exports.addSauce = (req, res, next) => {
    let sauceTmp = JSON.parse(req.body.sauce); // get the url to modify it
    sauceTmp.imageUrl = 'http://localhost:3000/public/'+ req.file.filename; 
    new Sauce(sauceTmp).save().then(res.status(201).json(`Sauce id: ${sauceTmp._id} added`)).catch(error => res.status(400).json({ error })) // create a new sauce model then insert it to db 
}
// Update a sauce
exports.updateSauce = async (req, res, next) => { 
    // get former data sauce with the id
    let formerSauce = await Sauce.findOne({ _id: req.params.id })
    // .then(res => res); 
    let sauceTmp = req.file ? JSON.parse(req.body.sauce) : req.body; 
    req.file ? sauceTmp.imageUrl = 'http://localhost:3000/public/'+req.file.filename : null;
    // initialize for sauce updates
    let updatesMessage = '';
    // compare which entries has changed and push into string
    Object.entries(sauceTmp).forEach(([key,value]) => updatesMessage += sauceTmp[key] != formerSauce[key] ? `${key}, ` : '')
    Sauce.updateOne({ _id: req.params.id }, sauceTmp).then(() => res.status(200).json({ message: `Sauce id: ${ req.params.id} updated with ${updatesMessage.slice(0, -2)}.` })).catch(error => res.status(400).json({ error }))
}
// Delete a sauce in db and the image in directory
exports.deleteSauce = (req, res, next) => { 
   Sauce.findOne({ _id: req.params.id}).then(sauce => { // find the sauce by id
    fs.unlink('public/'+sauce.imageUrl.split('/public/')[1], (err) => { if (err) throw err // delete image from directory throw err if any
        Sauce.deleteOne({ _id: req.params.id}).then(res.status(200).json({ message: 'Sauce deleted' })).catch(error => res.status(400).json({ error })) // delete the sauce in db 
    })
   })
}
// Rate a sauce with like or dislike
exports.rateSauce = (req, res, next) => {
    switch (req.body.like){ // switch over the number passed
        case 1: // 1 mean add 1 like
            // retrieve the sauce with id and increment the likes +1 and push into usersLiked array the userId
            return Sauce.updateOne({ _id: req.params.id },{$inc: {likes: req.body.like++}, $push:{usersLiked: req.body.userId}}).then(res.status(200).json('+1 like')).catch(error => json({ error }))
        case -1: // -1 mean add 1 dislike
             // retrieve the sauce with id and increment the dislikes +1 and push into usersDisliked array the userId
            return Sauce.updateOne({ _id: req.params.id },{ $inc: {dislikes: req.body.like++}, $push: {usersDisliked: req.body.userId}}).then(res.status(200).json('+1 dislike')).catch(error => json({ error }))
        default : // 0 means the user cancel its rate
            return Sauce.findOne({ _id: req.params.id }).then(sauce => { // retrieve sauce with id
                // if the userLike array include user id pull userId from userLike array and incr by -1 the total likes and vice versa
                if(sauce.usersLiked.includes(req.body.userId)) Sauce.updateOne({ _id: req.params.id }, {$pull: {usersLiked: req.body.userId}, $inc:{likes: -1}}).then(res.status(200).json('Sauce modified')).catch(error => json({ error }))
                if(sauce.usersDisliked.includes(req.body.userId)) Sauce.updateOne({ _id: req.params.id }, {$pull: {usersDisliked: req.body.userId}, $inc:{dislikes: -1}}).then(res.status(200).json('Sauce modified')).catch(error => json({ error }))
            })
    }
}
