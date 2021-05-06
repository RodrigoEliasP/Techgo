'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    await queryInterface.createTable('categorias', {
      id:{
          primaryKey: true,
          autoIncrement:true,
          type: DataTypes.INTEGER,
      },
      nome: {
          type: DataTypes.STRING(40)
      },
      descricao:{
          type: DataTypes.TEXT
      }
  },
  {
      timestamps: false,
      underscored: false,
      tableName: 'categorias'
  });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('categorias');
     
  }
};
