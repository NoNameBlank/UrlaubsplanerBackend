const Sequelize = require('sequelize');
const sequelize = require('./dbConnector');

const User = sequelize.define('User', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  vorname: {
    type: Sequelize.STRING
  },
  nachname: {
    type: Sequelize.STRING
  },
  passwort: {
    type: Sequelize.STRING
  },
  gesUrlaub: {
    type: Sequelize.INTEGER
  }
});

module.exports = User;