// Import the 'password-validator' plugin

const passwordValidator = require('password-validator');

// Créer le schéma de mot de passe

const schemaPassword = new passwordValidator();

// Password scheme properties

schemaPassword
    .is().min(8)                         
    .is().max(100)                       
    .has().lowercase()                   
    .has().uppercase(1)                  
    .has().digits(2)                     //Au moins 2 numéros doivent utiliser
    .has().symbols(1)                    //symbole
    .has().not().spaces()                // pas d'espace

// Créer la fonction de validité du mot de passe

const isPasswordValid = password => (schemaPassword.validate(password));

// Création de la fonction retournant les messages de validation

const validationMessages = password => {
    
    let messages = '';
    
    const arr = schemaPassword.validate(password, { details: true })
    
    for (let i = 0; i < arr.length; i++) {
        messages += arr[i].message + " *** ";
    }
    
    return messages;
}

// Exports

module.exports = { isPasswordValid, validationMessages };