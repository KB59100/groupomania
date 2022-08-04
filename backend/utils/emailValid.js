const validator = require('validator');

// Création de la fonction de validation des emails

const isEmailValid = email => validator.isEmail(email);

// Exports

module.exports = isEmailValid;