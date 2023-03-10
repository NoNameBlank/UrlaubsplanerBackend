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


//Fehler Handling!!!!--------------------------------> sollte Behoben sein

/*---UserDaten im Dashboard Laden--- */
router.get('/api/userById', async (req, res) => {
  try {
    var userId = req.query.userId;
    console.log("Hier drunter sollte die ID stehebn:")
    console.log(userId);
    var user = await User.findByPk(userId);
    if (!userId) {
      res.status(404).send('Benutzer nicht gefunden');
      return;
    }
    user.dataValues.appointments = [];
    var urlaub = await Urlaub.findAll({ where: { userId: userId } });
    if (urlaub) {

      if (user) {
        urlaub.forEach(element => {
          delete element.dataValues.createdAt;
          delete element.dataValues.updatedAt;
          user.dataValues.appointments.push(element.dataValues);
        });
        var data = user.dataValues;
        delete data.passwort;
        res.send({ data });
      }
    } else {
      res.status(404).send('Benutzer hat keinen Urlaub');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('User existiert nicht');
  }
});

/* -------------------------------------------------------------------API/URLAUB------------------------------------------------------------------------------------*/


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
  });

  newUrlaub.save()
    .then(() => {
      // console.log('Urlaub wurde gespeichert.');
      res.status(200).send();
    })
});

router.put('/api/urlaub', async (req, res) => {
  Urlaub.update({
    urlaubId: req.body.urlaubId,
    userId: req.body.userId,
    startDatum: req.body.startDatum,
    endDatum: req.body.endDatum,
    titel: req.body.titel,
    status: req.body.status
  },
    { where: { urlaubId: req.body.urlaubId } })
    .then(() => {
      console.log("Urlaub wurde aktualisiert");
      res.send();
    })
    .catch((error) => {
      console.error(error);
      res.send({ error });
    });
});

//Funktioniert nicht--------------------------------------------------------------------------------------------SOOOOLLLLLLLLLLLLLLTTTEEEEEEEEEEE klappen^^

/*---Ulaub L??schen--- */
router.delete('/api/urlaub', async (req, res) => {
  const { urlaubId, userId } = req.body;
  if (!urlaubId || !userId) {
    return res.status(400).send("Es wurde keine urlaubId oder userId ??bergeben.");
  }

  try {
    const affectedRows = await Urlaub.update({ userId: null }, { where: { urlaubId } });
    if (affectedRows > 0) {
      await Urlaub.destroy({ where: { userId } });
      res.send(`Urlaub mit urlaubId ${urlaubId} wurde gel??scht.`);
    } else {
      res.status(404).send(`Es wurde kein Urlaub mit urlaubId ${urlaubId} gefunden.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ein Fehler ist aufgetreten.");
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
    console.log("Hier dr??nter m??ssten alle User stehen");
    console.log(users);
  }
});


/*---CreateNew User in DB--- */
router.post('/api/user', async (req, res) => {
  User.sync().then(() => {
    const newUser = User.build({
    vorname: req.body.vorname,
    nachname: req.body.nachname,
    passwort: req.body.passwort,
    gesUrlaub: req.body.gesUrlaub,
    role: req.body.role,
    restUrlaub: req.body.restUrlaub,
    gepUrlaubsTage: req.body.gepUrlaubsTage,
    genUrlaubsTage: req.body.genUrlaubsTage,
    teamId: req.body.teamId

    })
    newUser.save()
      .then(() => {
        console.log('User wurde gespeichert.');

      })
      .catch((error) => {
        console.error(error);
        res.send({ error });
      });

    //Zur Kontrolle
    User.findAll().then(user => {

      console.log(user);
      res.send({ user });
    });
  });
});


// Funktioniert nicht-------------------------------sollte Funktionieren

/*---Update User in DB--- */
router.put('/api/user', async (req, res) => {
  // ??berpr??fen, ob die angegebene teamId in der Team Tabelle vorhanden ist
  const team = await Team.findByPk(req.body.teamId);
  if (!team) {
    res.status(400).send('Ung??ltige teamId');
    return;
  }
  console.log(req.body.teamId);
  // Aktualisiere den User mit den angegebenen Werten
  User.update({
    vorname: req.body.vorname,
    nachname: req.body.nachname,
    passwort: req.body.passwort,
    gesUrlaub: req.body.gesUrlaub,
    role: req.body.role,
    restUrlaub: req.body.restUrlaub,
    gepUrlaubsTage: req.body.gepUrlaubsTage,
    genUrlaubsTage: req.body.genUrlaubsTage,
    teamId: req.body.teamId
  },
    { where: { userId: req.body.userId } })
    .then(() => {
      console.log("User aktualisiert");
      res.send();
    })
    .catch((error) => {
      console.error(error);
      res.send({ error });
    });
});

//Error mit mismatch auf Team-----------------------Sollte Funktionieren

/*---Mitarbeiter L??schen--- */
router.delete('/api/user', (req, res) => {
  var data = req.body;
  if (data) {
    User.destroy({
      where: { userId: req.body.userId }
    })
    res.send("Mitarbeiter wurde gel??scht.")
  }
});

/* -------------------------------------------------------------------API/TEAMURLAUB------------------------------------------------------------------------------------*/

router.get('/api/urlaubTeam', async (req, res) => {
  var teamLeiterId = req.query.teamLeiterId;
  var userIdArray = [];
  var data = [];
  var userArrayClean =  [];
  console.log("Anfrage auf TeamleiterID: " + teamLeiterId);
  
  const TeamObject = await Team.findAll({
    where: { teamLeiterId: teamLeiterId },
  })
  if(TeamObject){
    // JOIN-Abfrage, um alle Benutzer und Urlaube zu finden, die mit der ??bergebenen "teamLeiterId" verkn??pft sind
    const userArray = await User.findAll({
      where: { teamId: TeamObject[0].dataValues.teamId },
    });
    userArray.forEach(user => {
      userIdArray.push(user.dataValues.userId);
      userArrayClean.push(user.dataValues)
    })
    console.log(userArrayClean);
    var urlaubsArray = await Urlaub.findAll({ where: { userId: userIdArray } });
    if (urlaubsArray) {
      urlaubsArray.forEach(urlaub => {
        var oEntry = userArrayClean.find(function (oEntry) {
          return oEntry.userId === urlaub.dataValues.userId;
        });
        urlaub.dataValues.vorname = oEntry.vorname;
        urlaub.dataValues.nachname = oEntry.nachname;
        urlaub.dataValues.restUrlaub = oEntry.restUrlaub;
        urlaub.dataValues.gepUrlaubsTage = oEntry.gepUrlaubsTage;
        data.push(urlaub.dataValues);
      });
      res.send(data);
    } else {
      res.send("Fehler beim Laden der Urlaubsdaten");
    }
  }else{
    res.status(404).send({ message: "Keine Team zur Teamleiter id gefunden" });
  }
});


/* -------------------------------------------------------------------API/USERTEAM------------------------------------------------------------------------------------*/
router.get('/api/userTeam', async (req, res) => {
  console.log(req.query);
  var teamLeiterId = req.query.teamLeiterId;
  var data = [];

  console.log("Anfrage auf TeamleiterID: " + teamLeiterId);
  
  const TeamObject = await Team.findAll({
    where: { teamLeiterId: teamLeiterId },
  })
  if(TeamObject[0]){
    console.log(TeamObject);

    const userArray = await User.findAll({
      where: { teamId: TeamObject[0].dataValues.teamId },
    });
  
    if (userArray) {
      for (let i = 0; i < userArray.length; i++) {
        const user = userArray[i];
        const userData = user.dataValues;
        delete userData.createdAt;
        delete userData.updatedAt;
        userData.appointments = [];
        const urlaub = await Urlaub.findAll({
          where: { userId: userData.userId }
        });
  
        if (urlaub && urlaub.length > 0) {
          urlaub.forEach(element => {
            delete element.dataValues.createdAt;
            delete element.dataValues.updatedAt;
            userData.appointments.push(element.dataValues);
          });
        }
  
        delete userData.passwort;
        data.push(userData);
      }
  
      res.send({ data });
    } else {
      res.status(404).send({ message: "Keine Benutzer gefunden" });
    }
  }else{
    res.status(404).send({ message: "Keine Team zur Teamleiter id gefunden" });
  }
 
});











/*---Create Team in DB--- */
router.post('/api/Team', async (req, res) => {
  Team.sync().then(() => {
    const newTeam = Team.build({
      teamLeiterId: req.body.teamLeiterId,
      teamName: req.body.teamName

    })
    newTeam.save()
      .then(() => {
        console.log('Team wurde gespeichert.');

      })
      .catch((error) => {
        // console.error(error);
        res.send({ error });
      });


    Team.findAll().then(team => {

      //console.log(team);
      res.send({ team });
    });
  });
});

/*---Team L??schen--- */
router.delete('/api/Team', async (req, res) => {
  /*
  Team.findAll({
    where: {
      teamLeiterId: 1 // oder andere ID
    }
  }).then(teams => {
    console.log(teams);
  });
 */
  const { teamLeiterId } = req.body;
  if (!teamLeiterId) {
    return res.status(400).send("Es wurde keine teamLeiterId ??bergeben.");
  }

  try {
    const affectedRows = await User.update({ teamLeiterId: null }, { where: { teamLeiterId } });
    if (affectedRows > 0) {
      await Team.destroy({ where: { teamLeiterId } });
      res.send(`Team mit teamLeiterId ${teamLeiterId} wurde gel??scht.`);
    } else {
      res.status(404).send(`Es wurde kein Team mit teamLeiterId ${teamLeiterId} gefunden.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Ein Fehler ist aufgetreten.");
  }
});















// router.delete('/api/team', async (req, res) => {
//   try {
//     const { teamLeiterId } = req.body;

//     // Find all users who reference this team as their team leader
//     const users = await User.findAll({ where: { teamLeiterId: teamLeiterId } });

//     // Set teamLeiterId to null for all users that reference this team
//     await Promise.all(
//       users.map(async (user) => {
//         user.teamLeiterId = null;
//         await user.save();
//       })
//     );

//     // Delete the team
//     await Team.destroy({ where: { teamLeiterId } });

//     res.send(`Team mit der ID ${teamLeiterId} wurde erfolgreich gel??scht.`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Ein Fehler ist aufgetreten. Das Team konnte nicht gel??scht werden.');
//   }
// });



/*---FEhler Ursache L??schen--- 
router.delete('/api/userTeam', async (req, res) => {
  try {
    const teamId = req.body.teamId;

    // Pr??fen, ob es Datens??tze in der "User"-Tabelle gibt, die auf das zu l??schende Team verweisen
    const users = await User.findAll({
      where: { teamId: teamId }
    });

    if (users.length > 0) {
      // Wenn es Datens??tze gibt, die auf das zu l??schende Team verweisen, diese Datens??tze l??schen
      await User.destroy({
        where: { teamId: teamId }
      });
    }

    // Das Team l??schen
    await Team.destroy({
      where: { teamId: teamId }
    });

    res.send("Team wurde gel??scht.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim L??schen des Teams.");
  }
});
*/


module.exports = router;