'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trabalhador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Categoria, {foreignKey: 'Categoria_id'});
      this.hasMany(models.Pedido, {foreignKey: 'trabalhadores_id'});

    }
  };
  Trabalhador.init({
    id:{
        primaryKey: true,
        type: DataTypes.UUIDV4
    },
    pfp:{
      type: DataTypes.STRING(120)
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
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    tableName: 'trabalhadores',
    modelName: 'Trabalhador',
  });
  return Trabalhador;
};