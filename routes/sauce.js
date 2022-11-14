

const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

const sauceCtrl = require('../controller/sauce')

router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/', auth, multer, sauceCtrl.createSauce)


module.exports = router