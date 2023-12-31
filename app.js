const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const port = 3333;
const app = express();
const functions = require(__dirname + "/functions.js");
const database = require(__dirname + "/models.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async function (req, res) {
    let fecha = await functions.darFechaHoy();
    let numRepas = await database.contarReparaciones();
    let numClientes = await database.contarClientes();
    let numTelefonos = await database.contarTelefonos();
    functions.obtenerTiempo().then((result) => {
        res.render("home", { fecha: fecha, tiempo: result[0], imagen: result[1], numeroRepas: numRepas, numeroClientes: numClientes, numeroTelefonos: numTelefonos });
    });

});


app.get("/consultas", function (req, res) {
    res.render("consultas");
});

app.post("/buscarBDfecha", async function (req, res) {
    try {
        let pack = []
        let data = await database.buscarBDfecha(req.body.fech);
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
        res.render("buscarBD", { pack: pack });
    }
    catch (error) {
        res.render("error", { message: "Fecha inválida o inexistente. Vuelva a intentarlo." });
    }
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
    res.render("buscarBD", { pack: pack });
});

app.post("/buscarBDnombre", async function (req, res) {
    let pack = []
    let data = await database.buscarBDnombre(req.body.nYa);
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
    res.render("buscarBD", { pack: pack });
});

app.post("/reparacionHoyCargada", async function (req, res) {
    try {
        const fecha = new Date();
        const fe = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
        let im = Number(req.body.imei);
        if (functions.validadorImei(im) != 0) {
            res.render("error", { message: "IMEI incorrecto" });
        }
        else {
            let cli = _.startCase(req.body.cli);
            let gar = "";
            let cc = "";
            let ct = "";
            let obs = "";
            let nt = "";
            let moc = functions.numeroModeloColor(req.body.mc);
            let ret = functions.numeroReparacionTipo(req.body.rt);
            let rev = functions.numeroReventa(req.body.rv);
            if (req.body.gar == "1") {
                gar = 1;
            } else {
                gar = 0;
            }
            if (req.body.obs == "") {
                obs = null;
            }
            else {
                obs = req.body.obs;
            }
            if (req.body.nt == "") {
                nt = null;
            } else {
                nt = req.body.nt;
            }
            const [rep, createdCli, createdTel] = await database.cargarReparacion(cli, req.body.em, nt, moc, im, ret, rev, req.body.cod, gar, obs, fe);
            if (createdCli) {
                cc = "El cliente se cargó correctamente."
            } else {
                cc = "El cliente ya existía."
            }
            if (createdTel) {
                ct = "El equipo se cargó correctamente."
            } else {
                ct = "El equipo ya existía."
            }
            res.render("reparacionCargada", { imei6: (im % 1000000), messageCli: cc, messageTel: ct, message: "La reparación se cargó correctamente con ID: " + rep.idReparacion });
        }

    }
    catch (error) {
        res.render("error", { message: "Ocurrió un error. Consulte si se pudo cargar o vuelva a intentarlo." });
    }
});

app.post("/reparacionHoySinClienteCargada", async function (req, res) {
    const fecha = new Date();
    const fe = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    let im = Number(req.body.imei);
    if (functions.validadorImei(im) != 0) {
        res.render("error", { message: "IMEI incorrecto" });
    }
    else {
        let gar = "";
        let cc = "";
        let ct = "";
        let obs = "";
        let nt = "";
        let moc = functions.numeroModeloColor(req.body.mc);
        let ret = functions.numeroReparacionTipo(req.body.rt);
        let rev = functions.numeroReventa(req.body.rv);
        if (req.body.gar == "1") {
            gar = 1;
        } else {
            gar = 0;
        }
        if (req.body.obs == "") {
            obs = null;
        }
        else {
            obs = req.body.obs;
        }
        if (req.body.nt == "") {
            nt = null;
        } else {
            nt = req.body.nt;
        }
        const [rep, createdTel] = await database.cargarReparacionSinCliente(moc, im, ret, rev, req.body.cod, gar, obs, fe);
        cc = "La reparación se cargó sin cliente"
        if (createdTel) {
            ct = "El equipo se cargó correctamente."
        } else {
            ct = "El equipo ya existía."
        }
        res.render("reparacionCargada", { imei6: (im % 1000000), messageCli: cc, messageTel: ct, message: "La reparación se cargó correctamente con ID: " + rep.idReparacion });
    }

});

app.post("/reparacionSinClienteCargada", async function (req, res) {
    let im = Number(req.body.imei);
    if (functions.validadorImei(im) != 0) {
        res.render("error", { message: "IMEI incorrecto" });
    }
    else {
        let gar = "";
        let cc = "";
        let ct = "";
        let obs = "";
        let nt = "";
        let moc = functions.numeroModeloColor(req.body.mc);
        let ret = functions.numeroReparacionTipo(req.body.rt);
        let rev = functions.numeroReventa(req.body.rv);
        if (req.body.gar == "1") {
            gar = 1;
        } else {
            gar = 0;
        }
        if (req.body.obs == "") {
            obs = null;
        }
        else {
            obs = req.body.obs;
        }
        if (req.body.nt == "") {
            nt = null;
        } else {
            nt = req.body.nt;
        }
        const [rep, createdTel] = await database.cargarReparacionSinCliente(moc, im, ret, rev, req.body.cod, gar, obs, req.body.fe);
        cc = "La reparación se cargó sin cliente"
        if (createdTel) {
            ct = "El equipo se cargó correctamente."
        } else {
            ct = "El equipo ya existía."
        }
        res.render("reparacionCargada", { imei6: (im % 1000000), messageCli: cc, messageTel: ct, message: "La reparación se cargó correctamente con ID: " + rep.idReparacion });
    }

});

app.post("/reparacionCargada", async function (req, res) {
    let im = Number(req.body.imei);
    if (functions.validadorImei(im) != 0) {
        res.render("error", { message: "IMEI incorrecto" });
    }
    else {
        let cli = _.startCase(req.body.cli);
        let gar = "";
        let cc = "";
        let ct = "";
        let obs = "";
        let nt = "";
        let moc = functions.numeroModeloColor(req.body.mc);
        let ret = functions.numeroReparacionTipo(req.body.rt);
        let rev = functions.numeroReventa(req.body.rv);
        if (req.body.gar == "1") {
            gar = 1;
        } else {
            gar = 0;
        }
        if (req.body.obs == "") {
            obs = null;
        }
        else {
            obs = req.body.obs;
        }
        if (req.body.nt == "") {
            nt = null;
        } else {
            nt = req.body.nt;
        }
        const [rep, createdCli, createdTel] = await database.cargarReparacion(cli, req.body.em, nt, moc, im, ret, rev, req.body.cod, gar, obs, req.body.fe);
        if (createdCli) {
            cc = "El cliente se cargó correctamente."
        } else {
            cc = "El cliente ya existía."
        }
        if (createdTel) {
            ct = "El equipo se cargó correctamente."
        } else {
            ct = "El equipo ya existía."
        }
        res.render("reparacionCargada", { imei6: (im % 1000000), messageCli: cc, messageTel: ct, message: "La reparación se cargó correctamente con ID: " + rep.idReparacion });
    }

});

app.post("/cargarOtraReparacion", function (req, res) {
    let pack = req.body.pack.split(",");
    res.render("cargarOtraReparacion", { pack: pack });
});

app.post("/otraReparacionCargada", async function (req, res) {
    const fecha = new Date();
    const fechaStr = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
    let pack = req.body.pack.split(",");
    let im = Number(pack[1]);
    if (functions.validadorImei(im) != 0) {
        res.render("error", { message: "IMEI incorrecto" });
    }
    else {
        let gar = "";
        let cc = "";
        let ct = "";
        let obs = "";
        let cli = "";
        let em = "";
        let cod = "";
        let nt = "";
        let moc = functions.numeroModeloColor(pack[2] + " " + pack[3]);
        let ret = functions.numeroReparacionTipo(req.body.rt);
        let rev = functions.numeroReventa(req.body.rv);
        if (req.body.gar == "1") {
            gar = 1;
        } else {
            gar = 0;
        }
        if (req.body.obs == "") {
            obs = null;
        }
        else {
            obs = req.body.obs;
        }
        if (req.body.cli == "") {
            cli = req.body.cli2;
        }
        else {
            cli = req.body.cli;
        }

        if (req.body.em == "") {
            em = req.body.em2;
        }
        else {
            em = req.body.em;
        }

        if (req.body.cod == "") {
            cod = req.body.cod2;
        }
        else {
            cod = req.body.cod;
        }

        if (req.body.nt == "") {
            nt = req.body.nt2;
        }
        else {
            nt = req.body.nt;
        }

        const [rep, createdCli, createdTel] = await database.cargarReparacion(cli, em, nt, moc, im, ret, rev, cod, gar, obs, fechaStr);
        res.render("otraReparacionCargada", { imei6: (im % 1000000), message: "La reparación se cargó correctamente con ID: " + rep.idReparacion });
    }
});

app.post("/buscarBDentreFechas", async function (req, res) {
    try {
        let pack = []
        let data = await database.buscarBDentreFechas(req.body.fech1, req.body.fech2);
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
        res.render("buscarBD", { pack: pack });
    }
    catch (error) {
        console.log(error)
        res.render("error", { message: "Fechas inválidas o inexistentes. Vuelva a intentarlo." });
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
