const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite:./Urlaubsplaner.db');

module.exports = sequelize;