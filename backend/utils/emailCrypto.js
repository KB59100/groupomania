// Functions to encrypt and decrypt an email
// Import the 'crypto-js' package
const CryptoJS = require("crypto-js");

require('dotenv').config();

const encrypt = email => {

    const pass = process.env.CRYPTOJS_KEY;
    const key = CryptoJS.enc.Utf8.parse(pass);

    const encrypted = CryptoJS.AES.encrypt(email, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();

}

const decrypt = string => {

    const pass = process.env.CRYPTOJS_KEY;
    const key = CryptoJS.enc.Utf8.parse(pass);

    const decrypted = CryptoJS.AES.decrypt(string, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
        
    return decrypted.toString(CryptoJS.enc.Utf8);

}

module.exports = {
    encrypt,
    decrypt
};