const Sauce = require('../models/sauce')
const fs = require('fs');

// Récuperer la liste de toutes les sauces
exports.getSauces =  (req, res, next) => {
     Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }))
}

// Créer une sauce
exports.addSauce = (req, res, next) => {
    let sauceTmp = JSON.parse(req.body.sauce); 
    sauceTmp.imageUrl = 'http://localhost:3000/public/'+ req.file.filename; 
    const sauce = new Sauce(sauceTmp); 
    sauce.save()
    .then(() => res.status(201).json({ message: `Sauce id: ${sauce._id} added`  }))
    .catch(error => res.status(400).json({ error }))
}

// Récuperer une seule sauce
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }))
}

exports.updateSauce = async (req, res, next) => { 
    // get former data sauce
    let formerSauce = await Sauce.findOne({ _id: req.params.id }).then(res => res); 

    let sauceTmp = req.file ? JSON.parse(req.body.sauce) : req.body; 
    req.file ? sauceTmp.imageUrl = 'http://localhost:3000/public/'+req.file.filename : null;

    // initialize for sauce updates
    let updatesMessage = '';

    // compare which entries has changed and push into string
    Object.entries(sauceTmp).forEach(([key,value]) => { 
        if (sauceTmp[key] != formerSauce[key]) updatesMessage += `${key}, `;
    })

    Sauce.updateOne({ _id: req.params.id }, sauceTmp)
        .then(() => res.status(200).json({ message: `Sauce id: ${ req.params.id} updated with ${updatesMessage.slice(0, -2)}.` }))
        .catch(error => {console.log(error); console.log('error'); res.status(400).json({ error })})
}

exports.deleteSauce = (req, res, next) => { 
   Sauce.findOne({ _id: req.params.id})
   .then(sauce => { 
    console.log(sauce.imageUrl);

    console.log(sauce.imageUrl.split('/public/')[1]); 
    fs.unlink('public/'+sauce.imageUrl.split('/public/')[1], (err) => {
        if (err){ console.log(err); }
        Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce deleted' }))
            .catch(error => res.status(400).json({ error: error }))
    })
   })
}
exports.rateSauce = (req, res, next) => {
    console.log(req.body)
    switch (req.body.like){ 
        case 1: 
            Sauce.updateOne({ _id: req.params.id }, {$inc : { likes: req.body.like++ }, $push:{ usersLiked: req.body.userId }} )
                .then((sauce) => { console.log(sauce); res.status(200).json({ message: 'Sauce modified' })}).catch(error => json({ error }))
        break; 
        case -1:
            Sauce.updateOne({ _id: req.params.id },  { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                .then((sauce) =>  { console.log(sauce); res.status(200).json({ message: 'Sauce modified' })}).catch(error => json({ error }))
        break; 
        default : 
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                            .then((sauce) => { console.log(sauce); res.status(200).json({ message: 'Sauce modified' }) }).catch(error => json({ error }))
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then((sauce) => { console.log(sauce); res.status(200).json({ message: 'Sauce modified' }) }).catch(error => json({ error }))
                    }
                })

    }
}
