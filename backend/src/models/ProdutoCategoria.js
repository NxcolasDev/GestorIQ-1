'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProdutoCategoria = sequelize.define('ProdutoCategoria', {
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  ProdutoCategoria.associate = (models) => {
    ProdutoCategoria.belongsTo(models.Produto, {
      foreignKey: 'produtoId'
    });

    ProdutoCategoria.belongsTo(models.Categoria, {
      foreignKey: 'categoriaId'
    });
  };

  return ProdutoCategoria;
};