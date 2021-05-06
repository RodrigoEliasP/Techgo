'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    await queryInterface.createTable('pedidos', {
      id_pedido:{
          primaryKey: true,
          type: DataTypes.UUID
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
          type: DataTypes.UUID,
          defaultValue: null,
          references:{
            key:"id",
            model:{
              tableName:"trabalhadores"
            }
          }
      },
      usuarios_id: {
          type: DataTypes.UUID,
          references:{
            key:"id",
            model:{
              tableName:"usuarios"
            }
          }
      },
  },{
      timestamps: true,
      underscored: true,
      tableName: 'pedidos'
  });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('pedidos');
     
  }
};
