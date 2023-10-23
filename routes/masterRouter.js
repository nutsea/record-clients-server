const Router = require('express')
const router = new Router()
const masterController = require('../controllers/masterController')

router.get('/', masterController.getAllApi)

module.exports = router