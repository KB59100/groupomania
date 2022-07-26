// Create the username validation function

const usernameValid = username => {
    
    if (/^[A-Za-z][A-Za-z0-9]{2,29}$/.test(username)) {
        return true;
    } else {
        return false;
    }
}



module.exports = usernameValid;