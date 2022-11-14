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
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

// Récuperer une seule sauce
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }))
}

exports.updateSauce = (req, res, next) => { 
    let sauceTmp = req.file ? JSON.parse(req.body.sauce) : req.body; 
    req.file ? sauceTmp.imageUrl = 'http:localhost:3000/public'+req.file.filename : null; 

    Sauce.updateOne({ _id: req.params.id }, sauceTmp)
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => { 
   console.log(req.params.id); 




   Sauce.findOne({ _id: req.params.id})
   .then(sauce => { 
    console.log(sauce.imageUrl);

    console.log(sauce.imageUrl.split('/public/')[1]); 
    fs.unlink('public/'+sauce.imageUrl.split('/public/')[1], (err) => {
        if (err){ console.log(err); }
        Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(400).json({ error: error }))
    })
   })

}