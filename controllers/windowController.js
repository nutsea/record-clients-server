const {Window, Booking} = require('../models/models')
const ApiError = require('../error/apiError')

class WindowController {
    async create(req, res, next) {
        try {
            const {date, time, master_id} = req.body
            const isExist = await Window.findOne({where: {date, time, master_id}})
            const isBooked = await Booking.findOne({where: {date, time, master_id}})
            if (!isExist && !isBooked) {
                const window = await Window.create({date, time, master_id})
                return res.json(window)
            } else {
                if (isExist) return res.json(isExist)
                if (isBooked) return next(ApiError.badRequest())
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const {date, master_id} = req.query
            const windows = await Window.findAll({where: {date, master_id}})
            return res.json(windows)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query
            const window = await Window.findOne({where: {id}})
            await window.destroy()
            return res.json(window)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new WindowController()