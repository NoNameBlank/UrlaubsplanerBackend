const express = require('express');
const User = require('./userDBsyn');

const app = express();

User.sync();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});