'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produtos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      descricao: {
        type: Sequelize.TEXT
      },

      preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      quantidade: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produtos');
  }
};