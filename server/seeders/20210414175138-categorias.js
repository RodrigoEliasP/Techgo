'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categorias', [{
        nome: 'Técnico',
        descricao: 'especialista em aparelhos eletronicos'
      },{
        nome: 'Eletricista',
        descricao: 'especialista em redes elétricas'
      }]
    );
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('categorias', {nome:['Técnico', 'Eletricista']}, {});
     
  }
};
