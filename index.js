const express = require('express');
const User = require('./userDBsyn');

const app = express();

const router = express.Router();

// Define a route
// router.get('/api/users', (req, res) => {
//   User.findAll().then(user => {
    
//     console.log(user);
//   });
// });

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

app.get('/api/users', (req, res) => {
  User.findAll().then(user => {
  
      console.log(user);
      res.send(user);
    });
 
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

