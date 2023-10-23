const Router = require('express')
const router = new Router()
const bookingController = require('../controllers/bookingController')

router.get('/', bookingController.getAll)
router.post('/create', bookingController.create)
router.delete('/', bookingController.delete)

module.exports = router