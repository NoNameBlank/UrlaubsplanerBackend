const User = require('../userDBsyn');
const Urlaub = require('../urlaubDBsyn');
const express = require('express');
const router = express.Router();

/*--------------------------------------------------------Login Ablgeich----------------------------------------------------------------------*/

router.get('/api/login', async (req, res) => {
  var username = req.query.userName;
  var userPW = req.query.passwort;
  var user = await User.findAll();
  var oEntry = user.find(function (oEntry) {
    return oEntry.dataValues.vorname === username;
  });
  if (oEntry) {
    if (oEntry.dataValues.passwort === userPW) {
      res.send({ "userId": oEntry.dataValues.userId });
    } else {
      res.status(404).send('Falsches Passwort');
    }
  } else {
    res.status(404).send('Benutzer nicht gefunden');
  }
});

/*-----------------------------------------------------UserDaten im Dashboard Laden----------------------------------------------------------- */

router.get('/api/userdetails', async (req, res) => {
  var userId = req.query.userId;
  var user = await User.findByPk(userId);
  user.dataValues.appointments = [];
  var urlaub = await Urlaub.findAll({where : {userId : userId}});
  if (user) {
    urlaub.forEach(element => {
      delete element.dataValues.createdAt;
      delete element.dataValues.updatedAt;
      user.dataValues.appointments.push(element.dataValues);
    });
    var data = user.dataValues;
    delete data.passwort;
    res.send({data});
  } else {
    res.status(404).send('Benutzer nicht gefunden');
  }
});

module.exports = router;