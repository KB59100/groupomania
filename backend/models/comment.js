"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Méthode d'assistance pour définir des associations.
     * Cette méthode ne fait pas partie du cycle de vie de Sequelize.
     * Le fichier `models/index` appellera cette méthode automatiquement.
     */
    static associate(models) {
      // définir l'association ici
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          foreignKey: "userId",
          targetKey: "id",
        },
        // onDelete: "CASCADE",
      });
      models.Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
          // name: "postId",
          targetKey: "id",
          foreignKey: "postId",
        },
        onDelete: "CASCADE",
      });
    }
  }
  Comment.init(
    {
      // userId: DataTypes.INTEGER,
      // postId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
