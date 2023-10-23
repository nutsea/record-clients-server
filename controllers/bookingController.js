const {Booking, Master, Window} = require('../models/models')
const ApiError = require('../error/apiError')
const { Telegraf, Markup, session } = require('telegraf')
const token = '6987408364:AAE2u-qfNfbvM1EHei0A9_Tf8QI0q0vqPt0'
const bot = new Telegraf(token)

const formatTime = (time) => {
    let [hh, mm] = time.split(':')
    return hh + ':' + mm
}

const formatDate = (date) => {
    let [yy, mm, dd] = date.split('-')
    return dd + '.' + mm + '.' + yy
}

class BookingController {
    async create(req, res, next) {
        try {
            const {date, time, type, name, phone, price, master_id} = req.body
            const isExist = await Booking.findOne({where: {date, time, master_id}})
            if (!isExist) {
                const booking = await Booking.create({date, time, type, name, phone, price, master_id})
                const master = await Master.findOne({where: {id: master_id}})
                bot.telegram.sendMessage(master.chatId, `НОВАЯ ЗАПИСЬ\n\nДата: ${formatDate(date)}\nВремя: ${formatTime(time)}\nУслуга: ${type}\nСтоимость: ${price}\n\n${name}\n+${phone}`)
                const window = await Window.findOne({where: {date, time, master_id}})
                window.destroy()
                return res.json(booking)
            } else {
                return next(ApiError.badRequest())
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const {date, master_id} = req.query
            const bookings = await Booking.findAll({where: {date, master_id}})
            return res.json(bookings)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query
            const booking = await Booking.findOne({where: {id}})
            await booking.destroy()
            return res.json(booking)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BookingController()