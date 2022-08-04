const fs = require("fs");
const db = require("../models");

// ********** Créer un POSTE **********
// ****************************************
exports.createPost = (req, res, next) => {

  let postObj;

  if (req.file) {
    const content = JSON.parse(req.body.post).content.trim();

    if (content !== "" && content.length < 2) {
      return res.status(400).json({
        message: "Le message doit contenir au moins deux caractères",
      });
    }

    postObj = {
      content: content,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    const content = req.body.content.trim();

    // Validation du contenu du message lorsqu'il n'y a pas d'image

    if (content.length < 2) {
      return res.status(400).json({
        message: "Le message doit contenir au moins deux caractères",
      });
    }

    postObj = { content: content, imageUrl: null };
  }

  // Enregistrer le message dans la BD

  db.Post.create({
    UserId: req.auth.userId,
    content: postObj.content,
    imageUrl: postObj.imageUrl,
  })
    .then(() =>
      res.status(201).json({
        message: "Message créé avec succès!",
      })
    )
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

// ********** Récupère tous les messages**********
// *********************************************** ****

exports.getAllPosts = (req, res, next) => {
  db.Post.findAll({
    order: [
      ["createdAt", "DESC"],
      [db.Comment, "createdAt", "ASC"],
      [db.Like, "createdAt", "ASC"],
    ],
    attributes: ["id", "content", "imageUrl", "createdAt", "updatedAt"],
    include: [
      {
        model: db.User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: db.Comment,
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["id", "username", "avatar"],
          },
        ],
      },
      {
        model: db.Like,
        attributes: ["id", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  })
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(400)
          .json({ message: "Erreur lors de la réception des messages" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

// ********** Récupère UN POST **********
// *********************************************

exports.getOnePost = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
    order: [
      [db.Comment, "createdAt", "ASC"],
      [db.Like, "createdAt", "ASC"],
    ],
    attributes: ["id", "content", "imageUrl", "createdAt", "updatedAt"],
    include: [
      {
        model: db.User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: db.Comment,
        attributes: ["id", "content"],
        include: [
          {
            model: db.User,
            attributes: ["id", "username", "avatar"],
          },
        ],
      },
      {
        model: db.Like,
        attributes: ["id", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  })
    .then((post) => {
      // Vérifier l'existence du poste

      if (post === null) {
        return res.status(404).json({
          message: "message introuvable!",
        });
      }
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

// ********** Récupère des POSTS d'utilisateurs **********
// *********************************************** *************

exports.getMyPosts = (req, res, next) => {
  db.Post.findAll({
    where: {
      userId: req.auth.userId,
    },
    order: [
      ["createdAt", "DESC"],
      [db.Comment, "createdAt", "ASC"],
      [db.Like, "createdAt", "ASC"],
    ],
    attributes: ["id", "content", "imageUrl", "createdAt", "updatedAt"],
    include: [
      {
        model: db.User,
        attributes: ["id", "username", "avatar"],
      },
      {
        model: db.Comment,
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["id", "username", "avatar"],
          },
        ],
      },
      {
        model: db.Like,
        attributes: ["id", "createdAt"],
        include: [
          {
            model: db.User,
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  })
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(400)
          .json({ message: "Erreur lors de la récupération des messages" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

// ********** Spprime POST ***********
// *********************************************

exports.deletePost = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((post) => {
      // Vérifier l'existence du poste

      if (post === null) {
        return res.status(400).json({
          message: "message introuvable!",
        });
      }

      // Vérifiez si l'utilisateur = le créateur de la publication ou l'administrateur

      db.User.findOne({
        where: {
          id: req.auth.userId,
        },
      })
        .then((user) => {
          if (req.auth.userId === post.UserId || user.isAdmin) {
            // Delete the image from the images folder (if image present)

            if (post.imageUrl !== null) {
              const filename = post.imageUrl.split("/images/")[1];

              fs.unlink(`images/${filename}`, (error) => {
                if (error) throw error;
                console.log("Post image deleted!");
              });
            }

            // Delete the post from the db

            db.Post.destroy({
              where: {
                id: req.params.id,
              },
            })
              .then(() =>
                res.status(200).json({
                  message: `Post deleted!`,
                })
              )
              .catch((error) =>
                res.status(400).json({
                  error,
                  message: error.message,
                })
              );
          } else {
            return res.status(403).json({
              message: "Demande non autorisée!",
            });
          }
        })
        .catch((error) => {
          res.status(400).json({
            message: error.message,
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

// ********** Modification  POST ***********
// **********************************************

exports.updatePost = (req, res, next) => {
  // Validation du contenu des messages

  const content =
    req.file === undefined
      ? req.body.content.trim()
      : JSON.parse(req.body.post).content.trim();

  // 2 scenarios
  // case 1: image dans le message ET longueur du message = 1 caractère (0 est autorisé)
  // case 2: pas d'image dans le message ET longueur du message inférieure à 2 caractères

  if (
    ((req.file || req.body.keepPreviousImg) && content.length === 1) ||
    (!req.file && !req.body.keepPreviousImg && content.length < 2)
  ) {
    return res.status(400).json({
      message: "Le message doit contenir au moins deux caractères",
    });
  }

  db.Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((post) => {
      // Vérifier l'existence du poste

      if (post === null) {
        return res.status(400).json({
          message: "message introuvable!",
        });
      }

      // Vérifier si utilisateur = créateur de publication

      if (req.auth.userId !== post.UserId) {
        return res.status(403).json({
          message: "Demande non autorisée!",
        });
      }

      // Supprimer l'ancienne image du dossier images s'il existe

      //Condition = il y avait déjà une image ET (nous avons une nouvelle image téléchargée ou nous voulons supprimer l'image)

      const deleteImg = req.body.deleteImg;

      if (post.imageUrl !== null && (req.file || deleteImg)) {
        const filename = post.imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, (error) => {
          if (error) throw error;
          console.log("Image de l'ancien message supprimée!");
        });
      }

      // Vérifier la présence de l'image dans la requête

      let postObj;

      if (req.file) {
        //Traiter l'objet avec une nouvelle image

        const content = JSON.parse(req.body.post).content.trim();

        postObj = {
          content: content,
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
      } else {
        // Traiter l'objet sans image téléchargée

        const content = req.body.content.trim();

        const imageUrl = deleteImg ? null : post.imageUrl;

        postObj = {
          content: content,
          imageUrl: imageUrl,
        };
      }

      // Mise à jour du post dans la bd

      db.Post.update(
        {
          ...postObj,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then(() =>
          res.status(200).json({
            message: "Post mis à jour !",
            updatedData: postObj,
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
      res.status(500).json({
        message: error.message,
        error,
      });
    });
};
