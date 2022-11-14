const Sauce = require('../models/sauce')

// Récuperer la liste de toutes les sauces
exports.getSauces =  (req, res, next) => {
     Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error: error }))
}

// Créer une sauce
exports.addSauce = (req, res, next) => {
    let sauceTmp = JSON.parse(req.body.sauce); 
    sauceTmp.imageUrl = '../public/'+ req.file.filename; 
    const sauce = new Sauce(sauceTmp); 
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

// Récuperer une seule sauce
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }))
}