'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize; 
    const transaction = await queryInterface.sequelize.transaction();
    await queryInterface.createTable('trabalhadores', {
      id:{
          primaryKey: true,
          type: DataTypes.UUID
      },
      pfp: {
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
          type: DataTypes.ENUM(['ativo', 'inativo', 'premium']),
          defaultValue: 'ativo'
      },
      data_nascimento:{
          type: DataTypes.DATEONLY
      },
      data_registro:{
          type: DataTypes.DATE
      },
      Categoria_id:{
        type: DataTypes.INTEGER,
        references:{
          key:"id",
          model:{
            tableName:"categorias"
          }
        }
      }
    },{
        timestamps: false,
        underscored: true,
        tableName: 'trabalhadores'
    },{
      transaction
    });
    await queryInterface.addIndex(
      'trabalhadores',
      ['cpf', 'email'],
      {
        transaction,
        indicesType: 'UNIQUE',
        where: { bool : 'true' },
      }
    );
    transaction.commit();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('trabalhadores');
  }
};
