const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('HuevoApple', 'diego01', 'diego03', {
    host: 'localhost',
    port: 49500,
    dialect: 'mssql'
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
        allowNull: false
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
    { freezeTableName: true },
    { tableName: 'dbo.Cliente' }
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
    tableName: 'Telefono' },
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
    { freezeTableName: true },
    { tableName: 'dbo.Modelo' }
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
    { freezeTableName: true },
    { tableName: 'dbo.Color' }
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
    { freezeTableName: true },  
    { tableName: 'dbo.ModeloColor' }  
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
    { freezeTableName: true },
    { tableName: 'dbo.ReparacionTipo' }
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
    { freezeTableName: true },
    { tableName: 'dbo.Reventa' }
);

Telefono.hasMany(Reparacion, {foreignKey: 'idTelefono'});
Reparacion.belongsTo(Telefono, { foreignKey: 'idTelefono' });

Reparacion.hasMany(Cliente, { foreignKey: 'idCliente' });
Cliente.belongsTo(Reparacion, { foreignKey: 'idCliente' });

Reparacion.hasMany(ReparacionTipo, { foreignKey: 'idReparacionTipo' });
ReparacionTipo.belongsTo(Reparacion, { foreignKey: 'idReparacionTipo' });

Reparacion.hasMany(Reventa, { foreignKey: 'idReventa' });
Reventa.belongsTo(Reparacion, { foreignKey: 'idReventa' });

Telefono.hasMany(ModeloColor, { foreignKey: 'idModeloColor' });
ModeloColor.belongsTo(Telefono, { foreignKey: 'idModeloColor' });

ModeloColor.hasMany(Modelo, { foreignKey: 'idModelo' });
Modelo.belongsTo(ModeloColor, { foreignKey: 'idModelo' });

ModeloColor.hasMany(Color, { foreignKey: 'idColor' });
Color.belongsTo(ModeloColor, { foreignKey: 'idColor' });


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

async function findAll() {
    const reparaciones = await Reparacion.findAll({include: Telefono},{ 
        attributes: ['idReparacion', 'idTelefono', 'fecha']});
    console.log(reparaciones.every(reparacion => reparacion instanceof Reparacion));
    const strReparaciones = JSON.stringify(reparaciones, null, 2);
    console.log(strReparaciones);
}

async function close(){
    await sequelize.close();
};

module.exports = {authenticate, synchronize, findAll, close};