const { Master } = require('../models/models')
const ApiError = require('../error/apiError')
const path = require('path')
const uuid = require('uuid')
const fs = require('fs')

class MasterController {
    async create(name, type, chatId) {
        try {
            const isExists = await Master.findOne({ where: { chatId } })
            if (!isExists) {
                const master = await Master.create({ name, type, chatId })
                console.log(master)
                return master.name
            } else {
                isExists.name = name
                await isExists.save()
                return name
            }
        } catch (e) {
            console.log(e)
            return ApiError.badRequest(e.message)
        }
    }

    async setPhoto(img, chatId) {
        const master = await Master.findOne({ where: { chatId } })
        try {
            if (master.img) {
                const filePath = path.resolve(__dirname, '..', 'static', master.img)
                fs.unlink(filePath, (e) => {
                    if (e) {
                        console.log('Ошибка при удалении файла:', e)
                    } else {
                        console.log('Старое фото успешно удалено')
                    }
                })
            }
            master.img = img
            await master.save()
            return master.name
        } catch (e) {
            console.log(e)
            return ApiError.badRequest(e.message)
        }
    }

    async delete(chatId) {
        const master = await Master.findOne({ where: { chatId } })
        if (master.img) {
            const filePath = path.resolve(__dirname, '..', 'static', item.img)
            fs.unlink(filePath, (e) => {
                if (e) {
                    console.log('Ошибка при удалении файла:', e)
                } else {
                    console.log('Файл успешно удален')
                }
            })
        }
        await master.destroy()
        return master
    }

    async getAll() {
        try {
            const masters = await Master.findAll()
            return masters
        } catch (e) {
            return ApiError.badRequest(e.message)
        }
    }

    async getAllApi(req, res, next) {
        try {
            const masters = await Master.findAll()
            return res.json(masters)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new MasterController()