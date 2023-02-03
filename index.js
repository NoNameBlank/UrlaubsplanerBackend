const express = require('express');
const User = require('./userDBsyn');

const app = express();

User.sync().then(() => {
  console.log("User table created");
  //create a new user instance
  const newUser = User.build({
    userId: 1,
    vorname: 'Peter',
    nachname: 'Harley',
    passwort: "123",
    gesUrlaub: 30
   

  });

  //save the user to the database
  newUser.save()
    .then(() => {
      console.log('User has been saved.');
    })
    .catch((error) => {
      console.error(error);
    });
  User.findAll().then(user => {
    
    console.log(user);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

