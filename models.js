const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize('HuevoApple', 'diego01', 'diego03', {
    host: 'localhost',
    port: 49918,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1
        }
    }
});

const Reparacion = sequelize.define('Reparacion', {
    idReparacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    idTelefono: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    idCliente: {
        type: DataTypes.INTEGER,
    },

    idReparacionTipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    idReventa: {
        type: DataTypes.INTEGER
    },

    codigo: {
        type: DataTypes.STRING
    },

    esGarantia: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    observaciones: {
        type: DataTypes.STRING,
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }

},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'Reparacion'
    }
);

const Cliente = sequelize.define('Cliente', {
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    nombreYapellido: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    numeroTelefono: {
        type: DataTypes.STRING
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'Cliente'
    }
);

const Telefono = sequelize.define('Telefono', {
    idTelefono: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    idModeloColor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    imei: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'Telefono'
    }
);

const Modelo = sequelize.define('Modelo', {
    idModelo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'Modelo'
    }
);

const Color = sequelize.define('Color', {
    idColor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'Color'
    }
);

const ModeloColor = sequelize.define('ModeloColor', {
    idModeloColor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    idModelo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    idColor: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'ModeloColor'
    }
);

const ReparacionTipo = sequelize.define('ReparacionTipo', {
    idReparacionTipo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'ReparacionTipo'
    }
);

const Reventa = sequelize.define('Reventa', {
    idReventa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'Reventa'
    }
);

Telefono.hasMany(Reparacion, { foreignKey: 'idTelefono' });
Reparacion.belongsTo(Telefono, { foreignKey: 'idTelefono' });

Cliente.hasMany(Reparacion, { foreignKey: 'idCliente' });
Reparacion.belongsTo(Cliente, { foreignKey: 'idCliente' });

ReparacionTipo.hasMany(Reparacion, { foreignKey: 'idReparacionTipo' });
Reparacion.belongsTo(ReparacionTipo, { foreignKey: 'idReparacionTipo' });

Reventa.hasMany(Reparacion, { foreignKey: 'idReventa' });
Reparacion.belongsTo(Reventa, { foreignKey: 'idReventa' });

ModeloColor.hasMany(Telefono, { foreignKey: 'idModeloColor' });
Telefono.belongsTo(ModeloColor, { foreignKey: 'idModeloColor' });

Modelo.hasMany(ModeloColor, { foreignKey: 'idModelo' });
ModeloColor.belongsTo(Modelo, { foreignKey: 'idModelo' });

Color.hasMany(ModeloColor, { foreignKey: 'idColor' });
ModeloColor.belongsTo(Color, { foreignKey: 'idColor' });

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

async function synchronize() {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
}

async function buscarBDfecha(fecha1) {
    var resultadoFinal = [];
    const reparaciones = await Reparacion.findAll({
        where: { fecha: fecha1 }, include:
            [Telefono,
                Cliente,
                ReparacionTipo,
                Reventa]
    });
    if (reparaciones.every(reparacion => reparacion instanceof Reparacion)) {

        reparaciones.forEach(rep => {
            var resultado = {}
            resultado["idReparacion"] = rep.idReparacion;
            resultado["IMEI"] = rep.Telefono.imei;
            resultado["idModeloColor"] = rep.Telefono.idModeloColor
            if (rep.Cliente == null) {
                resultado["Cliente"] = null;
                resultado["Email"] = null;
                resultado["Telefono"] = null;
            }
            else {
                resultado["Cliente"] = rep.Cliente.nombreYapellido;
                resultado["Email"] = rep.Cliente.email;
                resultado["Telefono"] = rep.Cliente.numeroTelefono;
            }
            resultado["Codigo"] = rep.codigo;
            resultado["Reparacion"] = rep.ReparacionTipo.descripcion;
            resultado["Fecha"] = rep.fecha;
            resultado["Observaciones"] = rep.observaciones;
            if (rep.idReventa == null) {
                resultado["Reventa"] = null
            }
            else {
                resultado["Reventa"] = rep.Reventum.nombre;
            }
            resultado["Garantia"] = rep.esGarantia;
            resultadoFinal.push(resultado);
        });
        return resultadoFinal;
    }
};

async function buscarBDimei(imei) {
    var resultadoFinal = [];
    const reparaciones = await Reparacion.findAll({
        include:
            [Telefono,
                Cliente,
                ReparacionTipo,
                Reventa]
    });
    if (reparaciones.every(reparacion => reparacion instanceof Reparacion)) {

        const repas = reparaciones.sort(function (a, b) {
            return new Date(a.fecha) - new Date(b.fecha);
        });

        repas.forEach(rep => {
            if (rep.Telefono.imei % 1000000 == imei) {
                var resultado = {}
                resultado["idReparacion"] = rep.idReparacion;
                resultado["IMEI"] = rep.Telefono.imei;
                resultado["idModeloColor"] = rep.Telefono.idModeloColor
                if (rep.Cliente == null) {
                    resultado["Cliente"] = null;
                    resultado["Email"] = null;
                    resultado["Telefono"] = null;
                }
                else {
                    resultado["Cliente"] = rep.Cliente.nombreYapellido;
                    resultado["Email"] = rep.Cliente.email;
                    resultado["Telefono"] = rep.Cliente.numeroTelefono;
                }
                resultado["Codigo"] = rep.codigo;
                resultado["Reparacion"] = rep.ReparacionTipo.descripcion;
                resultado["Fecha"] = rep.fecha;
                resultado["Observaciones"] = rep.observaciones;
                if (rep.idReventa == null) {
                    resultado["Reventa"] = null
                }
                else {
                    resultado["Reventa"] = rep.Reventum.nombre;
                }
                resultado["Garantia"] = rep.esGarantia;
                resultadoFinal.push(resultado);
            }
        });
        return resultadoFinal;
    }
};

async function buscarBDnombre(nYa) {
    var resultadoFinal = [];
    const reparaciones = await Reparacion.findAll({
        include:
            [Telefono,
                Cliente,
                ReparacionTipo,
                Reventa]
    });
    if (reparaciones.every(reparacion => reparacion instanceof Reparacion)) {

        const repas = reparaciones.sort(function (a, b) {
            return new Date(a.fecha) - new Date(b.fecha);
        });

        repas.forEach(rep => {
            if (rep.Cliente != null) {
                if (rep.Cliente.nombreYapellido.includes(nYa)) {
                    var resultado = {}
                    resultado["idReparacion"] = rep.idReparacion;
                    resultado["IMEI"] = rep.Telefono.imei;
                    resultado["idModeloColor"] = rep.Telefono.idModeloColor
                    if (rep.Cliente == null) {
                        resultado["Cliente"] = null;
                        resultado["Email"] = null;
                        resultado["Telefono"] = null;
                    }
                    else {
                        resultado["Cliente"] = rep.Cliente.nombreYapellido;
                        resultado["Email"] = rep.Cliente.email;
                        resultado["Telefono"] = rep.Cliente.numeroTelefono;
                    }
                    resultado["Codigo"] = rep.codigo;
                    resultado["Reparacion"] = rep.ReparacionTipo.descripcion;
                    resultado["Fecha"] = rep.fecha;
                    resultado["Observaciones"] = rep.observaciones;
                    if (rep.idReventa == null) {
                        resultado["Reventa"] = null
                    }
                    else {
                        resultado["Reventa"] = rep.Reventum.nombre;
                    }
                    resultado["Garantia"] = rep.esGarantia;
                    resultadoFinal.push(resultado);
                }
            }
        });
        return resultadoFinal;
    }
};

async function buscarBDentreFechas(fecha1, fecha2) {
    var resultadoFinal = [];
    const reparaciones = await Reparacion.findAll({
        where: { fecha: { [Op.between]: [fecha1, fecha2] } }, include:
            [Telefono,
                Cliente,
                ReparacionTipo,
                Reventa]
    });
    if (reparaciones.every(reparacion => reparacion instanceof Reparacion)) {

        const repas = reparaciones.sort(function (a, b) {
            return new Date(a.fecha) - new Date(b.fecha);
        });
        repas.forEach(rep => {
            var resultado = {}
            resultado["idReparacion"] = rep.idReparacion;
            resultado["IMEI"] = rep.Telefono.imei;
            resultado["idModeloColor"] = rep.Telefono.idModeloColor
            if (rep.Cliente == null) {
                resultado["Cliente"] = null;
                resultado["Email"] = null;
                resultado["Telefono"] = null;
            }
            else {
                resultado["Cliente"] = rep.Cliente.nombreYapellido;
                resultado["Email"] = rep.Cliente.email;
                resultado["Telefono"] = rep.Cliente.numeroTelefono;
            }
            resultado["Codigo"] = rep.codigo;
            resultado["Reparacion"] = rep.ReparacionTipo.descripcion;
            resultado["Fecha"] = rep.fecha;
            resultado["Observaciones"] = rep.observaciones;
            if (rep.idReventa == null) {
                resultado["Reventa"] = null
            }
            else {
                resultado["Reventa"] = rep.Reventum.nombre;
            }
            resultado["Garantia"] = rep.esGarantia;
            resultadoFinal.push(resultado);
        });
        return resultadoFinal;
    }
};

async function buscarModeloColor(idMC) {
    const modCol = await ModeloColor.findOne({ where: { idModeloColor: idMC }, include: [Modelo, Color] });
    if (modCol => modCol instanceof ModeloColor) {
        return [modCol.Modelo.nombre, modCol.Color.nombre];
    }
};

async function cargarCliente(nomYap, e_mail, numTel) {
    const [cli, created] = await Cliente.findOrCreate({ where: { email: e_mail }, defaults: { nombreYapellido: nomYap, email: e_mail, numeroTelefono: numTel } });
    if (cli => cli instanceof Cliente) {
        if (!created && numTel != null && numTel != "")
        {
            await Cliente.update({numeroTelefono: numTel}, { where: {email: e_mail}})
        }
        return [cli, created];
    }
}

async function cargarTelefono(idMC, im) {
    const [tel, created] = await Telefono.findOrCreate({ where: { imei: im }, defaults: { idModeloColor: idMC, imei: im } });
    if (tel => tel instanceof Telefono) {
        return [tel, created];
    }
}

async function cargarReparacion(nomYap, e_mail, numTel, idMC, im, idRT, idR, cod, gar, obs, fe) {
    const [cli, createdCli] = await cargarCliente(nomYap, e_mail, numTel);
    const [tel, createdTel] = await cargarTelefono(idMC, im);
    const rep = await Reparacion.create({ idTelefono: tel.idTelefono, idCliente: cli.idCliente, idReparacionTipo: idRT, idReventa: idR, codigo: cod, esGarantia: gar, observaciones: obs, fecha: fe })
    return [rep, createdCli, createdTel];
}

async function cargarReparacionSinCliente(idMC, im, idRT, idR, cod, gar, obs, fe) {
    const [tel, createdTel] = await cargarTelefono(idMC, im);
    const rep = await Reparacion.create({ idTelefono: tel.idTelefono, idCliente: null, idReparacionTipo: idRT, idReventa: idR, codigo: cod, esGarantia: gar, observaciones: obs, fecha: fe })
    return [rep, createdTel];
}

async function contarReparaciones()
{
    const { count, rows } = await Reparacion.findAndCountAll();
    return count;
}

async function contarClientes()
{
    const { count, rows } = await Cliente.findAndCountAll();
    return count;
}

async function contarTelefonos()
{
    const { count, rows } = await Telefono.findAndCountAll();
    return count;
}



async function close() {
    await sequelize.close();
};

module.exports = {
    authenticate, synchronize, buscarBDfecha, buscarModeloColor, buscarBDimei, buscarBDnombre, cargarCliente, cargarReparacion, cargarReparacionSinCliente,
    buscarBDentreFechas, contarReparaciones, contarClientes, contarTelefonos, close
};