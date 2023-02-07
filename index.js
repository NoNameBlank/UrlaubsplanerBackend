

const express = require('express');
const User = require('./userDBsyn');
const bodyParser = require('body-parser');
const expressMetadata = require('express-metadata');

const cors = require('cors');


const app = express();
app.use(cors());

//app.use(express.static(__dirname));


const router = express.Router();

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });


// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

//Metadaten erstellen
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 

module.exports = router;

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

app.get('/api/users', async (req, res) => {
  const user = await User.findAll();
      
    res.send(user);
    console.log(user);
  });



app.get("/api/$metadata", (req, res) => {
  res.type("application/xml");
  res.sendFile(`${__dirname}/metadata.xml`);
});




app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});






























