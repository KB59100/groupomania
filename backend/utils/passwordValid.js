// Import the 'password-validator' plugin

const passwordValidator = require('password-validator');

// Create the password scheme

const schemaPassword = new passwordValidator();

// Password scheme properties

schemaPassword
    .is().min(8)                         
    .is().max(100)                       
    .has().lowercase()                   
    .has().uppercase(1)                  
    .has().digits(2)                     //Atlest 2 number have to use
    .has().symbols(1)                    //Have to use atleast one special symbol
    .has().not().spaces()                // Should not have spaces

// Create the password validity function

const isPasswordValid = password => (schemaPassword.validate(password));

// Creation of the function returning the validation messages

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