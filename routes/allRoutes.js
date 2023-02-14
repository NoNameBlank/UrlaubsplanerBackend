const User = require('../userDBsyn');
const Urlaub = require('../urlaubDBsyn');
const express = require('express');
const router = express.Router();





/* -------------------------------------------------------------------API/USERDETAIL------------------------------------------------------------------------------------*/



/*---Login Ablgeich---*/
router.get('/api/userDetail', async (req, res) => {
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

/* -------------------------------------------------------------------API/USERBYID------------------------------------------------------------------------------------*/




/*---UserDaten im Dashboard Laden--- */
router.get('/api/userById', async (req, res) => {
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


/* -------------------------------------------------------------------API/URLAUB------------------------------------------------------------------------------------*/




/*---Gebuchter Urlaub wird vom Fontend an das Backend gesendet und in die Datenbank geschrieben--- */
router.post('/api/urlaub', async (req, res) => {
  var data = req.body;
  console.log(data);
  var newUrlaub = Urlaub.build({
    userId : data['oAppointment[userId]'],
    startDatum : data['oAppointment[start]'],
    endDatum : data['oAppointment[end]'],
    titel : data['oAppointment[title]'],
    status : data['oAppointment[status]']
    })
    newUrlaub.save().then(() => {
      // console.log('Urlaub wurde gespeichert.');
      res.send();
    })
    .catch((error) => {
      // console.error(error);
      res.send({error});
    });
});

/*---Ulaub Löschen--- */
router.delete('/api/urlaub', (req, res) => {
  var data = req.body;
  if(data){
    Urlaub.destroy({
      where : {urlaubId : data['oAppointment[urlaubId]'] }
    })
    res.send("DELETE Request Called")
  }
});

/*---GET Urlaub anhand der UserId--- */
router.get('/api/urlaub', async (req, res) => {
  var data = await Urlaub.findAll({where : {userId : userId}});
  if(data){
    res.send({data});
  } else {
    res.status(404).send('Keine Urlaube gefunden');
  }
 
});
/* -------------------------------------------------------------------API/User------------------------------------------------------------------------------------*/


/*---GET Alle User aus DB--- */
router.get('/api/user', async (req, res) => {
  var users  = await User.findAll();
  if(users){
    res.send({users});
    console.log("Hier drünter müssten allllle User stehen");
    console.log(users);
  }
});







module.exports = router;