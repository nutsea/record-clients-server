const {Service} = require('../models/models')
const ApiError = require('../error/apiError')

class ServiceController {
    async create(req, res, next) {
        try {
            const {name, price, master_id} = req.body
            const service = await Service.create({name, price, master_id})
            return res.json(service)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const {master_id} = req.query
            const services = await Service.findAll({where: {master_id}})
            return res.json(services)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query
            const service = await Service.findOne({where: {id}})
            await service.destroy()
            return res.json(service)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ServiceController()