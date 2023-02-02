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
  }
});

module.exports = User;