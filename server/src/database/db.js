const { Sequelize , DataTypes} = require('sequelize');

const connection = new Sequelize('techgo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

connection.authenticate().then(()=>{
    console.log('conectado');
}, ()=>{
    console.log('erro de conexão');
});

// define trabalhador
const mysqlTrabalhador = connection.define('trabalhadores', {
    id:{
        primaryKey: true,
        type: DataTypes.UUIDV4
    },
    cpf:{
        type: DataTypes.BIGINT(11)
    },
    nome:{
        type: DataTypes.STRING(80)
    },
    email:{
        type: DataTypes.STRING(80)
    },
    senha:{
        type: DataTypes.CHAR(40)
    },
    status:{
        type: DataTypes.ENUM(['ativo', 'inativo', 'premium'])
    },
    data_nascimento:{
        type: DataTypes.DATEONLY
    },
    data_registro:{
        type: DataTypes.DATE
    },
    Categoria_id:{
        type: DataTypes.INTEGER
    }
},{
    timestamps: false,
    underscored: true,
    modelName: 'trabalhadores'
});

//define categoria
const mysqlCategoria = connection.define('categoria', {
    id:{
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    Nome: {
        type: DataTypes.STRING(40)
    },
    Descricao:{
        type: DataTypes.TEXT
    }
},
{
    timestamps: false,
    underscored: false,
    modelName: 'categoria'
});
//define usuarios
const mysqlUsuarios = connection.define('usuarios', {
    id:{
        primaryKey: true,
        type: DataTypes.UUIDV4
    },
    cpf:{
        type: DataTypes.BIGINT(11)
    },
    nome:{
        type: DataTypes.STRING(80)
    },
    email:{
        type: DataTypes.STRING(80)
    },
    senha:{
        type: DataTypes.CHAR(40)
    },
    status:{
        type: DataTypes.ENUM(['ativo', 'inativo', 'premium'])
    },
    data_nascimento:{
        type: DataTypes.DATEONLY
    },
    data_registro:{
        type: DataTypes.DATE
    }
},{
    timestamps: false,
    underscored: true,
    modelName: 'usuarios'
});
//define Pedidos
const mysqlPedidos = connection.define('pedidos', {
    id_pedido:{
        primaryKey: true,
        type: DataTypes.UUIDV4
    },
    descricao: {
        type: DataTypes.TEXT
    },
    localizacao:{
        type: DataTypes.STRING(50)
    },
    data_criacao: {
        type: DataTypes.DATE
    },
    data_conclusao: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    valor_fechado: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: null
    },
    status:{
        type: DataTypes.ENUM(['pendente', 'cobrar', 'fechado']),
        defaultValue: 'pendente'
    },
    trabalhadores_id: {
        type: DataTypes.UUIDV4,
        defaultValue: null
    },
    usuarios_id: {
        type: DataTypes.UUIDV4
    },
},{
    timestamps: false,
    underscored: true,
    tableName: 'pedidos'
})
// associações
//categoria 1 N trabalhadores
mysqlCategoria.hasMany(mysqlTrabalhador, {foreignKey: 'Categoria_id'});
mysqlTrabalhador.belongsTo(mysqlCategoria, {foreignKey: 'Categoria_id'});
//trabalhadores 1 N pedidos
mysqlTrabalhador.hasMany(mysqlPedidos, {foreignKey: 'trabalhadores_id'})
mysqlPedidos.belongsTo(mysqlTrabalhador, {foreignKey: 'trabalhadores_id'})
//pedidos N M usuarios
mysqlUsuarios.hasMany(mysqlPedidos, {foreignKey: 'usuarios_id'})
mysqlPedidos.belongsTo(mysqlUsuarios, {foreignKey: 'usuarios_id'})
//exports
module.exports = {
    con: connection, 
    mysqlTrabalhador, 
    mysqlCategoria, 
    mysqlUsuarios, 
    mysqlPedidos};