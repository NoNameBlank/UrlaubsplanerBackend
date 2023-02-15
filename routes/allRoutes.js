const User = require('../userDBsyn');
const Urlaub = require('../urlaubDBsyn');
const Team = require('../teamDBsyn');
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


//Fehler Handling!!!!

/*---UserDaten im Dashboard Laden--- */
router.get('/api/userById', async (req, res) => {
  var userId = req.query.userId;
  var user = await User.findByPk(userId);
  user.dataValues.appointments = [];
  var urlaub = await Urlaub.findAll({ where: { userId: userId } });
  if (user) {
    urlaub.forEach(element => {
      delete element.dataValues.createdAt;
      delete element.dataValues.updatedAt;
      user.dataValues.appointments.push(element.dataValues);
    });
    var data = user.dataValues;
    delete data.passwort;
    res.send({ data });
  } else {
    res.status(404).send('Benutzer nicht gefunden');
  }
});


/* -------------------------------------------------------------------API/URLAUB------------------------------------------------------------------------------------*/


//Fehler Handling!!!!

/*---Gebuchter Urlaub wird vom Fontend an das Backend gesendet und in die Datenbank geschrieben--- */
router.post('/api/urlaub', async (req, res) => {
  var data = req.body;
  console.log(data);
  var newUrlaub = Urlaub.build({
    userId: data['oAppointment[userId]'],
    startDatum: data['oAppointment[start]'],
    endDatum: data['oAppointment[end]'],
    titel: data['oAppointment[title]'],
    status: data['oAppointment[status]']
  })
  newUrlaub.save().then(() => {
    // console.log('Urlaub wurde gespeichert.');
    res.send();
  })
    .catch((error) => {
      // console.error(error);
      res.send({ error });
    });
});

//Fehler Handling!!!!
//Funktioniert nicht

/*---Ulaub Löschen--- */
router.delete('/api/urlaub', (req, res) => {
  var urlaubId = req.body.urlaubId;
  if (urlaubId) {
    Urlaub.destroy({
      where: { urlaubId: urlaubId }
    })
    res.send("DELETE Request Called")
  }
});


/*---GET Urlaub anhand der UserId--- */
router.get('/api/urlaub', async (req, res) => {
  var userId = req.query.userId;
  var data = await Urlaub.findAll({ where: { userId: userId } });
  if (data) {
    res.send({ data });
  } else {
    res.status(404).send('Keine Urlaube gefunden');
  }

});
/* -------------------------------------------------------------------API/User------------------------------------------------------------------------------------*/


/*---GET Alle User aus DB--- */
router.get('/api/user', async (req, res) => {
  var users = await User.findAll();
  if (users) {
    res.send({ users });
    console.log("Hier drünter müssten alle User stehen");
    console.log(users);
  }
});


/*---CreateNew User in DB--- */
router.post('/api/user', async (req, res) => {
  User.sync().then(() => {
    const newUser = User.build({
      userId: 5,
      vorname: "Donald",
      nachname: "Duck",
      passwort: "333",
      gesUrlaub: 300,
      role: "Teamleiter",
      restUrlaub: 250,
      gepUrlaubsTage: 50,
      genUrlaubsTage: 49,
      teamLeiterId: 2

    })
    newUser.save()
      .then(() => {
        console.log('User wurde gespeichert.');

      })
      .catch((error) => {
        console.error(error);
        res.send({ error });
      });


    User.findAll().then(user => {

      console.log(user);
      res.send({ user });
    });
  });
});


// Funktioniert nicht

/*---Update User in DB--- */
router.put('/api/user', async (req, res) => {
   
  User.update({
    vorname: req.body.vorname,
    nachname: req.body.nachname,
    passwort: req.body.passwort,
    gesUrlaub: req.body.gesUrlaub,
    role: req.body.role,
    restUrlaub: req.body.restUrlaub,
    gepUrlaubsTage: req.body.gepUrlaubsTage,
    genUrlaubsTage: req.body.genUrlaubsTage,
    teamLeiterId: req.body.teamLeiterId
  },
    { where: { userId: req.body.userId} }
  ).then(() => {
    console.log("User aktualisiert");
    res.send();
  })
    .catch((error) => {
      console.error(error);
      res.send({ error });
    });
});

//Error mit mismatch auf Team

/*---Mitarbeiter Löschen--- */
router.delete('/api/user', (req, res) => {
  var data = req.body;
  if (data) {
    User.destroy({
      where: { userId: req.body.userId }
    })
    res.send("Mitarbeiter wurde gelöscht.")
  }
});

/* -------------------------------------------------------------------API/TEAMURLAUB------------------------------------------------------------------------------------*/

router.get('/api/teamUrlaub', async (req, res) => {
  var teamLeiterId = req.body.teamLeiterId;
  var userIdArray = [];
  var data = [];


  console.log("Anfrage auf TeamleiterID: "+teamLeiterId);
  // JOIN-Abfrage, um alle Benutzer und Urlaube zu finden, die mit der übergebenen "teamLeiterId" verknüpft sind
  const userArray = await User.findAll({
    where: { teamLeiterId: teamLeiterId } ,
  
  });
 

  userArray.forEach(user => {
    userIdArray.push(user.dataValues.userId);
  })

  var urlaubsArray = await Urlaub.findAll({ where: { userId: userIdArray } });

  if (urlaubsArray) {
    urlaubsArray.forEach(urlaub => {
      console.log(urlaub.dataValues);
      data.push(urlaub.dataValues);
    });
    res.send(data);
  } else {
    res.send("Fehler beim Laden der Urlaubsdaten");
  }
  
});


/* -------------------------------------------------------------------API/USERTEAM------------------------------------------------------------------------------------*/
router.get('/api/userTeam', async (req, res) => {
  var teamLeiterId = req.body.teamLeiterId;
  var nameArray = [];
  var data = [];


console.log("Anfrage auf TeamleiterID: "+teamLeiterId);
// JOIN-Abfrage, um alle Benutzer und Urlaube zu finden, die mit der übergebenen "teamLeiterId" verknüpft sind
const userArray = await User.findAll({
  where: { teamLeiterId: teamLeiterId } ,

});


userArray.forEach(user => {
  data.push(user.dataValues);
  console.log("Die namen der User aus deinem Team: " );
  console.log(data);
})
res.send(data);
console.log(data);
});



module.exports = router;