'use strict';

module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    preco: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Produto.associate = (models) => {
    Produto.belongsToMany(models.Categoria, {
      through: models.ProdutoCategoria,
      foreignKey: 'produtoId'
    });
  };

  return Produto;
};