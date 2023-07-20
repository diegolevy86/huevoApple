const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3333;
const app = express();
const validador = require(__dirname+"/functions.js");
const database = require(__dirname+"/models.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/buscarBDfecha/:fech", async function (req, res) {
    let pack = []
    let data = await database.buscarBDfecha(req.params.fech);
    console.log(data);
    for (var i = 0; i < data.length; i++){
        let row = []
        row.push(data[i].idReparacion)
        row.push(data[i].IMEI)
        let dato = await database.buscarModeloColor(data[i].idModeloColor);
        row.push(dato[0])
        row.push(dato[1])
        row.push(data[i].Cliente)
        row.push(data[i].Email)
        row.push(data[i].Telefono)
        row.push(data[i].Codigo)
        row.push(data[i].Fecha)
        row.push(data[i].Reparacion)
        row.push(data[i].Observaciones)
        row.push(data[i].Reventa)
        if (data[i].Garantia)
        {
            row.push("Sí");
        }
        else
        {
            row.push("");
        }
        pack.push(row);
    }
    res.render("results",{pack: pack})
});

app.listen(port, function () {
    console.log("Server started on port " + port);
});

//console.log(validador.validadorImei(355435071646557));

database.authenticate();
database.synchronize();

//data = await database.buscarBDfecha('2023-07-05');
//var myPromise = new Promise((resolve, reject) => { resolve(database.buscarBDfecha('2023-07-05'))});
//myPromise.then(data => console.log(data));

//database.buscarBDfecha('2023-07-05').then(data => console.log(data));
//database.buscarTodoModeloColor().then(data => console.log(data));
