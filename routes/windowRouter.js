const Router = require('express')
const router = new Router()
const windowController = require('../controllers/windowController')

router.get('/', windowController.getAll)
router.post('/create', windowController.create)
router.delete('/', windowController.delete)

module.exports = router