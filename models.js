const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('HuevoApple', 'diego01', 'diego03', {
    host: 'localhost',
    port: 49500,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1
        }
    }
});

const Reparacion = sequelize.define('Reparacion',{
    idReparacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
     {timestamps: false,
     freezeTableName:  true,
     tableName: 'Reparacion'}
);

const Cliente = sequelize.define('Cliente', {
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
    {timestamps: false,
    freezeTableName: true,
    tableName: 'Cliente' }
);

const Telefono = sequelize.define('Telefono', {
    idTelefono: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
    {timestamps: false,
    freezeTableName: true,
    tableName: 'Telefono' }
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
        tableName: 'Modelo' }
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
       tableName: 'Color'} 
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
        tableName: 'ModeloColor' }  
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
        tableName: 'ReparacionTipo' }
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
        tableName: 'Reventa' }
);

Telefono.hasMany(Reparacion, {foreignKey: 'idTelefono'});
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

async function authenticate()
{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

async function synchronize()
{
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
}

async function buscarBDfecha(fecha1) {
    var resultadoFinal = [];
    const reparaciones = await Reparacion.findAll({where: {fecha: fecha1}, include:
        [Telefono,
        Cliente,
        ReparacionTipo,
        Reventa]
        });
    if (reparaciones.every(reparacion => reparacion instanceof Reparacion))
    {
        
        reparaciones.forEach(rep => {
                console.log(rep);
                var resultado = {}
                resultado["idReparacion"] = rep.idReparacion;
                resultado["IMEI"] = rep.Telefono.imei;
                resultado["idModeloColor"] = rep.Telefono.idModeloColor
                if(rep.Cliente == null)
                {
                    resultado["Cliente"] = null;
                    resultado["Email"] = null;
                    resultado["Telefono"] = null;
                }
                else
                {
                    resultado["Cliente"] = rep.Cliente.nombreYapellido;
                    resultado["Email"] = rep.Cliente.email;
                    resultado["Telefono"] = rep.Cliente.numeroTelefono;
                }
                resultado["Codigo"] = rep.codigo;
                resultado["Reparacion"] = rep.ReparacionTipo.descripcion;
                resultado["Fecha"] = rep.fecha;
                resultado["Observaciones"] = rep.observaciones;
                if (rep.idReventa == null)
                { 
                    resultado["Reventa"] = null
                }
                else 
                { 
                    resultado["Reventa"] = rep.Reventum.nombre;
                }
                resultado["Garantia"] = rep.esGarantia;
                resultadoFinal.push(resultado);
            });
        return resultadoFinal;
    }
};

async function buscarModeloColor(idMC){
    const modCol = await ModeloColor.findOne({where: {idModeloColor: idMC}, include: [Modelo, Color]});
    if (modCol => modCol instanceof ModeloColor)
    {
        return [modCol.Modelo.nombre, modCol.Color.nombre];
    }
};

async function buscarReventa(idR) {
    const rev = await Reventa.findOne({ where: { idReventa: idR }});
    if (rev => rev instanceof Reventa) {
        return rev.nombre;
    }
};



/*
async function buscarTodoModeloColor() {
    let resul = {}
    let ct = 0;
    const modCol = await ModeloColor.findAll({ include: [Modelo, Color] });
    if (modCol.every(mc => mc instanceof ModeloColor))
    {
        modCol.forEach(mc => {
            let resu = {}
            resu["idModeloColor"] = mc.idModeloColor;
            resu["Modelo"] = mc.Modelo.nombre;
            resu["Color"] = mc.Color.nombre;
            resul[ct] = resu;
            ct = ct + 1;
        })
        return resul;
    }
}
*/

async function close(){
    await sequelize.close();
};

module.exports = { authenticate, synchronize, buscarBDfecha, buscarModeloColor, buscarReventa, close};