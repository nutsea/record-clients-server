const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const Master = sequelize.define('master', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255), allowNull: false},
    type: {type: DataTypes.STRING(255), allowNull: false},
    chatId: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING}
})

const Booking = sequelize.define('booking', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATEONLY, allowNull: false},
    time: {type: DataTypes.TIME, allowNull: false},
    type: {type: DataTypes.STRING(255), allowNull: false},
    name: {type: DataTypes.STRING(255), allowNull: false},
    phone: {type: DataTypes.STRING(11), allowNull: false},
    price: {type: DataTypes.INTEGER}
})

const Window = sequelize.define('window', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATEONLY, allowNull: false},
    time: {type: DataTypes.TIME, allowNull: false}
})

const Service = sequelize.define('service', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.STRING, allowNull: false}
})

Master.hasMany(Booking, {foreignKey: 'master_id'})
Booking.belongsTo(Master, {foreignKey: 'master_id'})

Master.hasMany(Window, {foreignKey: 'master_id'})
Window.belongsTo(Master, {foreignKey: 'master_id'})

Master.hasMany(Service, {foreignKey: 'master_id'})
Service.belongsTo(Master, {foreignKey: 'master_id'})

module.exports = {
    Master,
    Booking,
    Window,
    Service
}