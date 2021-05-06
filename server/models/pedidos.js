'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {foreignKey: 'usuarios_id'});
      this.belongsTo(models.Trabalhador, {foreignKey: 'trabalhadores_id'})
    }
  };
  Pedido.init({
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
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'pedidos',
    modelName: 'Pedido',
  });
  return Pedido;
};