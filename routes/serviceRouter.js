const Router = require('express')
const router = new Router()
const serviceController = require('../controllers/serviceController')

router.get('/', serviceController.getAll)
router.post('/create', serviceController.create)
router.delete('/', serviceController.delete)

module.exports = router