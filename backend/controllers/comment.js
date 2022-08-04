const db = require('../models');

// ********** Créer un COMMENTAIRE **********
// **********************************************

exports.createComment = (req, res, next) => {

    if (req.body.content.trim().length < 2) {
        return res.status(400).json({
          message: "Le message doit contenir au moins deux caractères",
        });
    }

    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {
      // Vérifier l'existence du poste
      if (post === null) {
        return res.status(404).json({
          message: "message introuvable!",
        });
      }

      // Enregistrer le commentaire dans la BD

      db.Comment.create({
        UserId: req.auth.userId,
        PostId: post.id,
        content: req.body.content,
      })
        .then(() =>
          res.status(201).json({
            message: "Commentaire ajouté!",
          })
        )
        .catch((error) => {
          res.status(400).json({
            message: error.message,
          });
        });
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};


// ********** Mise a jour du commentaire **********
// *********************************************** **

exports.updateComment = (req, res, next) => {

    if (req.body.content.trim().length < 2) {
        return res.status(400).json({
          message: "Le message doit contenir au moins deux caractères",
        });
    }

    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {

      // Vérifiez le message s'il existe

      if (post === null) {
        return res.status(404).json({
          message: "message introuvable!",
        });
      }

      db.Comment.findOne({
        where: {
          id: req.params.commentId,
        },
      })
        .then((comment) => {
          // Vérifie si le commentaire existe

          if (comment === null) {
            return res.status(404).json({
              message: "commentaire introuvable!",
            });
          }

          // Vérifier si utilisateur = créateur du commentaire

          if (req.auth.userId !== comment.userId) {
            return res.status(403).json({
              message:
                "Demande non autorisée! Vous n'avez pas le droit de modifier le commentaire!",
            });
          }

          // Mise a jour du commentaire dans la BD

          db.Comment.update(
            {
              content: req.body.content,
            },
            {
              where: {
                id: req.params.commentId,
              },
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Commentaire mis à jour!",
              })
            )
            .catch((error) => {
              res.status(400).json({
                message: error.message,
                error: error,
              });
            });
        })
        .catch((error) => {
          res.status(404).json({
            message: error.message,
            error,
          });
        });
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};


// ********** Suppression du commentaire**********
// *********************************************** **

exports.deleteComment = (req, res, next) => {

    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {

        // Vérifie si le post existe
        if (post === null) {
            return res.status(404).json({
              message: "message introuvable!",
            });
        }

        db.Comment.findOne({
            where: {
                id: req.params.commentId
            }
        }).then(comment => {
          // Vérifie si le commentaire existe

          if (comment === null) {
            return res.status(404).json({
              message: "commentaire introuvable!",
            });
          }

          // Vérifie si l'utilisateur = le créateur du commentaire ou l'administrateur

          db.User.findOne({
            where: {
              id: req.auth.userId,
            },
          })
            .then((user) => {
              if (req.auth.userId === comment.userId || user.isAdmin) {
                // Suppession du commentaire dans la BD

                db.Comment.destroy({
                  where: {
                    id: req.params.commentId,
                  },
                })
                  .then(() =>
                    res.status(200).json({
                      message: `Commentaire supprimé!`,
                    })
                  )
                  .catch((error) =>
                    res.status(400).json({
                      message: error.message,
                    })
                  );
              } else {
                return res.status(403).json({
                  message:
                    "Demande non autorisée ! Vous n'avez pas le droit de supprimer le commentaire",
                });
              }
            })
            .catch((error) => {
              res.status(404).json({
                message: error.message,
              });
            });
        })
        .catch(error => {
            res.status(404).json({
                message: error.message,
                error
            });
        });
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};
