"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Méthode d'assistance pour définir des associations.
     * Cette méthode ne fait pas partie du cycle de vie de Sequelize.
     * Le fichier `models/index` appellera cette méthode automatiquement.
     */
    static associate(models) {
      // définir l'association ici
      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          foreignKey: "userId",
          targetKey: "id",
        },
        onDelete: "CASCADE",
      });
      models.Post.hasMany(models.Comment);
      models.Post.hasMany(models.Like);
    }
  }
  Post.init(
    {
      // userId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
