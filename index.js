const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//Über Port 3000 ansprechzbar
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

//test