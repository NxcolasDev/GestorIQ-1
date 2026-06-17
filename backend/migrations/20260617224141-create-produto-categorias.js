'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProdutoCategorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      produtoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categorias',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('ProdutoCategorias');
  }
};