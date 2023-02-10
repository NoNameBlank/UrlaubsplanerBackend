
const express = require('express');
const User = require('./userDBsyn');
const Urlaub = require('./urlaubDBsyn');
const bodyParser = require('body-parser');

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const router = express.Router();

app.options("/*", function (req, res, next) { res.header('Access-Control-Allow-Origin', '*'); res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); res.send(200); });

// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

//Metadaten erstellen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Urlaub.belongsTo(User);
module.exports = router;
// User.sync().then(() => {
//   Urlaub.sync().then(() => {
//     const newUrlaub = Urlaub.build({
//       urlaubId: 2,
//       userId: 2,
//       startDatum: "03.03.2023",
//       endDatum: "05.03.2023",
//       titel: "Urlaub"
//     });

//     //save the user to the database
//     newUrlaub.save()
//         .then(() => {
//       console.log('User has been saved.');
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//     Urlaub.findAll().then(object => {

//       console.log(object);

//     });
//   });
// });
// User.sync().then(() => {
//   console.log("User table created");
// //create a new user instance
// const newUser = User.build({
//   userId: 2,
//   vorname: 'Susi',
//   nachname: 'Much',
//   passwort: "321",
//   gesUrlaub: 30,
//   role: "Admin",
//   restUrlaub: 20,
//   gepUrlaubsTage: 10,
//   genUrlaubsTage: 3


// });

// //save the user to the database
// newUser.save()
//   .then(() => {
//     console.log('User has been saved.');
//   })
//   .catch((error) => {
//     console.error(error);
//   });
//   User.findAll().then(user => {

//     console.log(user);
//   });
// });

//Routen

// app.get('/api/users', async (req, res) => {
//   const user = await User.findAll();

//   res.send(user);
//   console.log(user);
// });


/*--------------------------------------------------------Login Ablgeich----------------------------------------------------------------------*/





app.get('/api/login', async (req, res) => {
  // debugger;
  // console.log(req);
  var username = req.query.userName;
  var userPW = req.query.passwort;
  var user = await User.findAll();
  var oEntry = user.find(function (oEntry) {
    console.log(oEntry.dataValues);
    return oEntry.dataValues.vorname === username;
  });
  if (oEntry) {
    if (oEntry.dataValues.passwort === userPW) {

      res.send({ "userId": oEntry.dataValues.userId });
    } else {
      res.status(404).send('Sorry, cant find that');
    }


  } else {

    res.status(404).send('Sorry, cant find that');
  }


});
/*-----------------------------------------------------UserDaten im Dashboard Laden----------------------------------------------------------- */

app.get('/api/userdetails', async (req, res) => {
  var userId = req.query.userId;
  var user = await User.findByPk(userId);
  user.dataValues.appointments = [];
  var urlaub = await Urlaub.findAll({where : {userId : userId}});
  if (user) {
    urlaub.forEach(element => {
      delete element.dataValues.createdAt;
      delete element.dataValues.updatedAt;
      // console.log(element.dataValues);
      // element.dataValues.endDatum = new Date(element.dataValues.endDatum);
      // element.dataValues.startDatum = new Date(element.dataValues.endDatum);
      user.dataValues.appointments.push(element.dataValues);
    });
    
    var data = user.dataValues;
    delete data.passwort;
    console.log(data);
    res.send({data});
    console.log("User der Sich eingeloggt hat: " + user.userId + user.vorname + "Resturlaub: " +  user.restUrlaub);
  } else {
    res.status(404).send('Benutzer nicht gefunden');
  }
});


// app.set('/api/urlaub', async (req, res) => {
//   var data = req.query;
  
// });
/*------------------------------------------------------------Gebuchter Urlaub wird vom Fontend an das Backend gesendet und in die Datenbank geschrieben */
app.post('/api/urlaub', async (req, res) => {
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
      console.log('Urlaub wurde gespeichert.');
      res.send();
    })
    .catch((error) => {
      console.error(error);
      res.send({error});
    });
});


/*
app.get('/api/users', async (req, res) => {
  var userId = req.query.userId;
  var user = await User.findAll();
  var oEntry = user.find(function(oEntry){
    return oEntry.dataValues.userId == userId
  })

  res.send(user);
  console.log( " Das soll der Datensatz sein, der nur die Daten der Eingeloggten ID zurück gibt: " + user);
  debugger;
});

*/

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});






























