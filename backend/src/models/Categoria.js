'use strict';

module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Categoria.associate = (models) => {
    Categoria.belongsToMany(models.Produto, {
      through: models.ProdutoCategoria,
      foreignKey: 'categoriaId'
    });
  };

  return Categoria;
};