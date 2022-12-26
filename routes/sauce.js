

const express = require('express')
const router = express.Router()

// use middleware
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')
// use controller for sauce
const sauceController = require('../controller/sauce')

router.get('/', auth, sauceController.getSauces) // getAll the sauces in db (auth route)
router.post('/', auth, multer, sauceController.addSauce) // Add a sauce to db (auth route+multer sauce)
router.get('/:id', auth, sauceController.getSauce) // get a specific sauce (auth route)
router.put('/:id', auth, multer, sauceController.updateSauce) // update a sauce (auth route+multer sauce)
router.delete('/:id', auth, sauceController.deleteSauce) //delete a sauce from db (auth route)
router.post('/:id/like', auth, sauceController.rateSauce) // rate a sauce (auth route)

module.exports = router