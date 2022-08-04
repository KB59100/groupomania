'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Méthode d'assistance pour définir des associations.
     * Cette méthode ne fait pas partie du cycle de vie de Sequelize.
     * Le fichier `models/index` appellera cette méthode automatiquement.
     */
    static associate(models) {
      // définir l'association ici
      models.Like.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          foreignKey: "userId",
          targetKey: "id",
        },
        // onDelete: 'CASCADE'
      });
      models.Like.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
          foreignKey: "postId",
          targetKey: "id",
        },
        // onDelete: 'CASCADE'
      });
    }
  }
  Like.init({
    // userId: DataTypes.INTEGER,
    // postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};