const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3333;
const app = express();
const functions = require(__dirname+"/functions.js");
const database = require(__dirname+"/models.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home");
});

app.post("/buscarBDfecha", async function (req, res) {
    let pack = []
    let data = await database.buscarBDfecha(req.body.fech);
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
    res.render("buscarBDfecha", { pack: pack });
});

app.post("/buscarBDimei", async function (req, res) {
    let pack = []
    let data = await database.buscarBDimei(req.body.imei);
    for (var i = 0; i < data.length; i++) {
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
        if (data[i].Garantia) {
            row.push("Sí");
        }
        else {
            row.push("");
        }
        pack.push(row);
    }
    res.render("buscarBDimei", { pack: pack });
});

app.post("/cargarReparacion", async function(req, res) {
    let im = Number(req.body.imei);
    if (functions.validadorImei(im) != 0)
    {
        res.render("cargarReparacion", { messageCli: "", messageTel: "", message: "IMEI incorrecto"});
    }
    else
    {
        let gar = "";
        let cc = "";
        let ct = "";
        let obs = "";
        let moc = functions.numeroModeloColor(req.body.mc);
        let ret = functions.numeroReparacionTipo(req.body.rt);
        let rev = functions.numeroReventa(req.body.rv);
        if (req.body.gar == "1"){
            gar = 1;
        } else {
            gar = 0;
        }
        if (req.body.obs == "")
        {
            obs = null;
        }
        else {
            obs = req.body.obs;
        }
        const [rep, createdCli, createdTel] = await database.cargarReparacion(req.body.cli, req.body.em, req.body.nt, moc, im, ret, rev, req.body.cod, gar, req.body.obs, req.body.fe);
        if (createdCli){
            cc = "El cliente se cargó correctamente."
        } else {
            cc = "El cliente ya existía."
        }
        if (createdTel)
        {
            ct = "El equipo se cargó correctamente."
        } else {
            ct = "El equipo ya existía."
        }
        res.render("cargarReparacion", { messageCli: cc, messageTel: ct, message: "La reparación se cargó correctamente con ID = "+rep.idReparacion } );
    }
    
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

//database.cargarCliente("Diego Levy", "dielevy@gmail.com","2215988786").then(cliente => console.log(cliente[0],cliente[1]));
//database.cargarCliente("Rocio Berge", "rocioberge@gmail.com", "2215988786").then(cliente => console.log(cliente[0],cliente[1]));
//database.contarClientes();
