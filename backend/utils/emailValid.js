const validator = require('validator');

// Creation of the email validation function

const isEmailValid = email => validator.isEmail(email);

// Exports

module.exports = isEmailValid;