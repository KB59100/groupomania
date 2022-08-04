const db = require("../models");

// ********** Gestion des LIKE**********
// **********************************************

exports.like = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((post) => {
      // Vérifier l'existence du poste

      if (post === null) {
        return res.status(404).json({
          message: "message introuvable!",
        });
      }

      // Vérifiez si l'utilisateur aime le message ou non

      db.Like.findOne({
        where: {
          userId: req.auth.userId,
          postId: post.id,
        },
      })
        .then((likeFound) => {
          if (likeFound === null) {
            // Add a like

            db.Like.create({
              UserId: req.auth.userId,
              PostId: post.id,
            })
              .then(() =>
                res.status(201).json({
                  message: "Like ajouté!",
                })
              )
              .catch((error) => {
                res.status(400).json({
                  message: error.message,
                });
              });
          } else {
            // Supprime le like

            db.Like.destroy({
              where: {
                userId: req.auth.userId,
                postId: post.id,
              },
            })
              .then(() =>
                res.status(200).json({
                  message: `Like supprimé!`,
                })
              )
              .catch((error) =>
                res.status(400).json({
                  message: error.message,
                })
              );
          }
        })
        .catch((error) => {
          res.status(404).json({
            message: error.message,
            error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
        error,
      });
    });
};
