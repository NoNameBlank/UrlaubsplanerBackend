const Sequelize = require('sequelize');
const sequelize = require('./dbConnector');

const Team = sequelize.define('Team', {
    teamId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    teamLeiterId: {
      type: Sequelize.INTEGER
    }
},{
        tableName: "Team"
      });
      
      module.exports = Team;