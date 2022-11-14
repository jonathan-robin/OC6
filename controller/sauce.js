const Sauce = require('../models/sauce')
const fs = require('fs')

// Récuperer la liste de toutes les sauces
exports.getAllSauces =  (req, res, next) => {
     Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }))
}

// Créer une sauce
exports.createSauce = (req, res, next) => {

    console.log(req.body.sauce); 
    console.log(req.file.filename);
    let sauceTmp = JSON.parse(req.body.sauce); 
    sauceTmp.imageUrl = '../public/'+ req.file.filename; 
    console.log(sauceTmp); 


    
    const sauce = new Sauce(sauceTmp); 
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }))
    // console.log(sauce);
}