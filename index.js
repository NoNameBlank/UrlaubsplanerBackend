const express = require('express');
const User = require('./userDBsyn');

const app = express();

User.sync().then(() => {
  console.log("User table created");
  //create a new user instance
  // const newUser = User.build({
  //   userId: 2,
  //   vorname: 'Bob',
  //   nachname: 'marley',
  //   passwort: "54321",
  //   gesUrlaub: 30,
  //   createdAt: "",
  //   updatedAt: ""

  // });

  // //save the user to the database
  // newUser.save()
  //   .then(() => {
  //     console.log('User has been saved.');
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  User.findAll().then(users => {
    
    console.log(users);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

