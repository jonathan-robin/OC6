

const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

const sauceController = require('../controller/sauce')

router.get('/', auth, sauceController.getSauces)
router.post('/', auth, multer, sauceController.addSauce)
router.get('/:id', auth, sauceController.getSauce)
router.put('/:id', auth, multer, sauceController.updateSauce)
router.delete('/:id', auth, sauceController.deleteSauce)

module.exports = router