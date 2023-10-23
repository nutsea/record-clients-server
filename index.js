require('dotenv').config()
const express = require('express')
const sequelize = require('./db.js')
const models = require('./models/models.js')
const cors = require('cors')
const router = require('./routes/index.js')
const cron = require('node-cron')
const { Telegraf, Markup, session } = require('telegraf');
const path = require('path')
const https = require('https')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 5200

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/bot.taxiallrussia.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bot.taxiallrussia.ru/cert.pem')
}

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use('/static', express.static('static'))

const server = https.createServer(options, app)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

// const start = async () => {
//     try {
//         await sequelize.authenticate()
//         await sequelize.sync()
//         app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
//     } catch (e) {
//         console.log(e)
//     }
// }

start()

///// bot

const masterController = require('./controllers/masterController.js')

const token = '6987408364:AAE2u-qfNfbvM1EHei0A9_Tf8QI0q0vqPt0'
const bot = new Telegraf(token)
bot.use(session())

bot.start((ctx) => {
    const message = 'Здравствуйте!'
    const keyboard = Markup.keyboard([
        ['Аккаунт'],
        ['Информация']
    ]).resize()
    ctx.reply(message, keyboard)
})

bot.on('text', async (ctx) => {
    switch (ctx.message.text) {
        case 'Аккаунт':
            ctx.reply('Введите ваше имя и должность через пробел\n\nПример: Имя Барбер')
            ctx.session = 'name'
            return

        case 'Информация':
            ctx.reply('/masters - список всех мастеров\n\n/delete - удалить мастера')
            return

        case '/masters':
            try {
                const masters = await masterController.getAll()
                let mastersList = ''
                masters.map((master) => {
                    mastersList += master.name + ', ' + master.type + ', id: ' + master.chatId + '\n\n'
                })
                ctx.reply(mastersList)
            } catch (e) {
                console.log(e)
            }
            return
        case '/delete':
            ctx.reply('Введите пароль')
            ctx.session = 'delete'
            return
        default:
            break
    }
    switch (ctx.session) {
        case 'name':
            const [name, type] = ctx.message.text.split(' ')
            if (name && type) {
                await masterController.create(name, type, ctx.chat.id)
                ctx.session = 'photo'
                ctx.reply('Имя установлено\n\nОтправьте фото по желанию (как файл)')
            } else {
                ctx.reply('Вы не ввели должность\n\nПовторите попытку')
            }
            return

        case 'delete':
            if (ctx.message.text === 'alskdj') {
                ctx.reply('Введите id мастера, которого хотите удалить')
                ctx.session = 'deleteId'
            }
            else ctx.reply('Неверный пароль. Повторите попытку')
            return

        case 'deleteId':
            try {
                await masterController.delete(ctx.message.text)
                ctx.reply('Мастер удален')
            } catch (e) {
                ctx.reply('Такого id не существует. Повторите попытку')
            }
            return

        default:
            break
    }
})

bot.on('photo', (ctx) => {
    if (ctx.session === 'photo') {
        ctx.reply('Вы отправили фото обычным способом\n\nОтправьте в виде файла для сохранения в хорошем качестве')
    }
})

bot.on('document', async (ctx) => {
    if (ctx.session === 'photo') {
        const document = ctx.message.document
        const fileId = document.file_id
        const file = await bot.telegram.getFile(fileId)
        const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`
        const fileName = `${uuidv4()}.jpg`
        const savePath = `./static/${fileName}`
        const response = await fetch(fileUrl)
        const buffer = await response.arrayBuffer()
        fs.writeFile(savePath, Buffer.from(buffer), async (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(`Изображение успешно сохранено как ${fileName}`)
            await masterController.setPhoto(fileName, ctx.chat.id)
            ctx.reply('Фото установлено')
        })
    }
})

bot.launch()

module.exports = bot