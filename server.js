var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/register.htm");
});

app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/public/login.htm");
});

app.use(express.static("public"))

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});