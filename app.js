const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3333;
const app = express();
const validador = require(__dirname+"/functions.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home");
});

app.listen(port, function () {
    console.log("Server started on port " + port);
});

console.log(validador.validadorImei(355435071646557));