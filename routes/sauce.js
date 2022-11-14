

const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

const sauceCtrl = require('../controller/sauce')

router.get('/', auth, sauceCtrl.getSauces)
router.post('/', auth, multer, sauceCtrl.getSauce)
router.get('/:id', auth, sauceCtrl.getSauce)
router.put('/:id', auth, multer, sauceCtrl.updateSauce)

module.exports = router