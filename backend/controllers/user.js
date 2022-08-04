const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models');
const isEmailValid = require('../utils/emailValid');
const { isPasswordValid, validationMessages } = require('../utils/passwordValid');
const isUsernameValid = require('../utils/usernameValid');
const { encrypt, decrypt } = require('../utils/emailCrypto');

require('dotenv').config();


// ********** Gestion de la création d'un nouvel utilisateur **********
// *********************************************** ********************

exports.signup = (req, res) => {
  // Vérifier la validité du pseudo

  if (!isUsernameValid(req.body.username)) {
    return res.status(400).json({
      message:
        "Nom d'utilisateur invalide : doit commencer par une lettre et contenir entre 3 et 30 lettres et chiffres",
    });
  }

  // Vérifier la validité de l'e-mail

  if (!isEmailValid(req.body.email)) {
    return res.status(400).json({
      message: "Adresse e-mail non valide!",
    });
  }

  // Vérifier la validité du mot de passe

  if (!isPasswordValid(req.body.password)) {
    return res.status(400).json({
      message: validationMessages(req.body.password),
    });
  }

  // Email encryption

  const emailEncrypted = encrypt(req.body.email);

  // Hachage du mot de passe avant d'enregistrer le nouvel utilisateur dans la BD

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      db.User.create({
        username: req.body.username,
        email: emailEncrypted,
        password: hash,
        avatar: `${req.protocol}://${req.get(
          "host"
        )}/images/default-avatar.png`,
        isAdmin: req.body.isAdmin,
      })
        .then(() =>
          res.status(201).json({
            message: "Utilisateur créé!",
          })
        )
        .catch((error) => {
          const errorMessage = error.errors[0].message;

          let errorMessageToSend;

          if (errorMessage === "le nom d'utilisateur doit être unique") {
            errorMessageToSend = "pseudo déjà pris!";
          } else if (errorMessage === "l'e-mail doit être unique") {
            errorMessageToSend = "Adresse e-mail déjà prise!";
          } else {
            errorMessageToSend = errorMessage;
          }

          res.status(400).json({
            message: errorMessageToSend,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

// ********** Gestion des connexions utilisateurs**********
// *********************************************** *************

exports.signin = (req, res, next) => {
  // Récupérer le pseudo de la base de données

  db.User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      // Vérifier l'existence de l'utilisateur

      if (user === null) {
        return res.status(404).json({
          message: "Utilisateur non trouvé!",
        });
      }

      // Comparaison du mot de passe saisi par l'utilisateur avec le mot de passe haché dans la BD

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "Mauvais mot de passe!",
            });
          }
          // Renvoie le jtoken encodé contenant le userId
          res.status(200).json({
            userId: user.id,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              bio: user.bio,
              avatar: user.avatar,
              isAdmin: user.isAdmin,
            },
            token: jwt.sign(
              {
                userId: user.id,
              },
              process.env.TOKEN_SECRET_KEY,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) =>
          res.status(500).json({
            message: error.message,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        message: error.message,
      })
    );
};

// ********** Affichage du profil d'un utilisateur **********
// *********************************************** *************

exports.getUser = (req, res, next) => {
  // Récupération dans la base de données des informations utilisateur correspondant à l'identifiant dans la requête

  db.User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "username", "email", "bio", "avatar"],
  })
    .then((user) => {
      // Vérifier l'existence de l'utilisateur

      if (user === null) {
        return res.status(404).json({
          message: "Utilisateur non trouvé!",
        });
      }

      // Check user authorization

      if (req.auth.userId !== user.id) {
        return res.status(403).json({
          message: "Demande non autorisée!",
        });
      }

      // Decrypt temail BD
      const emailDecrypted = decrypt(user.email);

      // Objet avec les données à retourner

      const userData = {
        id: user.id,
        username: user.username,
        email: emailDecrypted,
        bio: user.bio,
        avatar: user.avatar,
      };

      res.status(200).json(userData);
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};


// ********** Changer password **********
// *********************************************** ********************

exports.updatePwdUser = (req, res, next) => {
  // Récupération dans la base de données des informations utilisateur correspondant à l'identifiant dans la requête
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      // Vérifier l'existence de l'utilisateur

      if (user === null) {
        return res.status(404).json({
          message: "Utilisateur non trouvé!",
        });
      }

      // Vérifier l'autorisation de l'utilisateur

      if (req.auth.userId !== user.id) {
        return res.status(403).json({
          message: "Demande non autorisée!",
        });
      }

      // Vérifier la validité du nouveau mot de passe

      if (!isPasswordValid(req.body.newPassword)) {
        return res.status(400).json({
          message: validationMessages(req.body.newPassword),
        });
      }

      // Comparez le mot de passe actuel et le mot de passe de la base de données

      bcrypt
        .compare(req.body.currentPassword, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "Mot de passe actuel incorrect!",
            });
          }

          // Hachage du nouveau mot de passe avant enregistrement dans la BD

          bcrypt
            .hash(req.body.newPassword, 10)
            .then((hash) => {
              db.User.update(
                {
                  password: hash,
                },
                {
                  where: {
                    id: req.params.id,
                  },
                }
              )
                .then(() =>
                  res.status(200).json({
                    message: "Mot de passe mis à jour!",
                  })
                )
                .catch((error) =>
                  res.status(400).json({
                    message: error.message,
                  })
                );
            })
            .catch((error) =>
              res.status(500).json({
                message: error.message,
              })
            );
        })
        .catch((error) =>
          res.status(500).json({
            message: error.message,
          })
        );
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

// ********** Suppression user **********
// *********************************************** **
exports.deleteUser = (req, res, next) => {

    db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(user => {
          // Vérifier l'existence de l'utilisateur

          if (user === null) {
            return res.status(404).json({
              message: "Utilisateur non trouvé!",
            });
          }

          // Vérifier l'existence de l'utilisateur

          if (req.auth.userId !== user.id) {
            return res.status(403).json({
              message: "Demande non autorisée!",
            });
          }

          const filename = user.avatar.split("/images/")[1];

          if (filename !== "default-avatar.png") {
            // Supprimer l'image du dossier images

            fs.unlink(`images/${filename}`, (error) => {
              if (error) throw error;
              console.log("Photo de profil supprimée!");
            });
          }

          db.User.destroy({
            where: {
              id: req.params.id,
            },
          })
            .then(() =>
              res.status(200).json({
                message: `Compte supprimé!`,
              })
            )
            .catch((error) =>
              res.status(400).json({
                message: error.message,
              })
            );
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });

};

// **********Mise a jour profile **********
// ******************************************

exports.updateUser = (req, res, next) => {
  // Bio longueur max

  const bio =
    req.file === undefined ? req.body.bio : JSON.parse(req.body.user).bio;

  if (bio !== null && bio.length > 255) {
    return res.status(400).json({
      message: "Bio trop longue ! 255 caractères maximum!",
    });
  }

  // Récupération dans la base de données des informations utilisateur correspondant à l'identifiant dans la requête
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      // Vérifier l'existence de l'utilisateur

      if (user === null) {
        return res.status(404).json({
          message: "Utilisateur non trouvé!",
        });
      }

      // Vérifier l'autorisation de l'utilisateur

      if (req.auth.userId !== user.id) {
        return res.status(403).json({
          message: "Demande non autorisée!",
        });
      }

      //Vérifier la présence de l'image dans la requête

      let userObj;

      if (req.file) {
        // Vérifier la validité du pseudo

        if (!isUsernameValid(req.body.user.username)) {
          return res.status(400).json({
            message:
              "Nom d'utilisateur invalide: doit commencer par une lettre et contenir entre 3 et 30caractères alphanumériques",
          });
        }

        const filename = user.avatar.split("/images/")[1];

        if (filename !== "default-avatar.png") {
          // Supprimer l'ancienne image du dossier images

          fs.unlink(`images/${filename}`, (error) => {
            if (error) throw error;
            console.log("Ancienne photo de profil supprimée!");
          });
        }

        // Traiter l'objet avec une nouvelle image

        userObj = {
          ...JSON.parse(req.body.user),
          avatar: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
      } else {
        // Vérifier la validation du pseudo

        if (!isUsernameValid(req.body.username)) {
          return res.status(400).json({
            message:
              "Nom d'utilisateur invalide: doit commencer par une lettre et contenir entre 3 et 30caractères alphanumériques",
          });
        }

        // Récupérer des données sans chargement d'image

        userObj = { ...req.body };
      }

      //Mettre à jour le profil utilisateur

      db.User.update(
        {
          ...userObj,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then(() =>
          res.status(200).json({
            message: "Profil mis à jour!",
            updatedData: userObj,
          })
        )
        .catch((error) => {
          const errorMessage = error.errors[0].message;

          let errorMessageToSend;

          if (errorMessage === "Profil mis à jour!") {
            errorMessageToSend = "pseudo déjà pris!";
          } else {
            errorMessageToSend = errorMessage;
          }

          res.status(400).json({
            message: errorMessageToSend,
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};