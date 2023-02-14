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
  },
  role: {
    type: Sequelize.STRING
  },
  restUrlaub: {
    type: Sequelize.INTEGER
  },
  gepUrlaubsTage: {
    type: Sequelize.INTEGER
  },
  genUrlaubsTage: {
    type: Sequelize.INTEGER
  },
  teamId: {
    type: Sequelize.INTEGER
  }
},{
  tableName: "User"
});

module.exports = User;