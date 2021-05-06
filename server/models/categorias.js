'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Trabalhador, {foreignKey: 'Categoria_id'});
    }
  };
  Categoria.init({
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
}, {
    sequelize,
    timestamps: false,
    underscored: false,
    tableName: 'categorias',
    modelName: 'Categoria',
  });
  return Categoria;
};