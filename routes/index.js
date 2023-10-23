const Router = require('express')
const router = new Router()
const masterRouter = require('./masterRouter')
const windowRouter = require('./windowRouter')
const serviceRouter = require('./serviceRouter')
const bookingRouter = require('./bookingRouter')

router.use('/master', masterRouter)
router.use('/window', windowRouter)
router.use('/service', serviceRouter)
router.use('/booking', bookingRouter)

module.exports = router