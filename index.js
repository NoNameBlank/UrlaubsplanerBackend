
const express = require('express');
const User = require('./userDBsyn');
const Urlaub = require('./urlaubDBsyn');
const bodyParser = require('body-parser');
const routes = require('./routes/allRoutes.js');

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




//Routen in routes ausgelagert
app.use('/', routes);





/*------------------------------------------------------------Gebuchter Urlaub wird vom Fontend an das Backend gesendet und in die Datenbank geschrieben */





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





























