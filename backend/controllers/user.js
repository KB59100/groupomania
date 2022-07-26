const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models');
const isEmailValid = require('../utils/emailValid');
const { isPasswordValid, validationMessages } = require('../utils/passwordValid');
const isUsernameValid = require('../utils/usernameValid');
const { encrypt, decrypt } = require('../utils/emailCrypto');

require('dotenv').config();


// ********** Management of the creation of a new user **********
// *********************************************** ********************

exports.signup = (req, res) => {

    // Check the validity of the nickname

    if (!isUsernameValid(req.body.username)) {
        return res.status(400).json({
            message: "Invalid username: must start with a letter and contain between 3 and 30 letters and numbers"
        });
    }

    // Check the validity of the email

    if (!isEmailValid(req.body.email)) {
        return res.status(400).json({
            message: 'Email address Invalid !'
        });
    }

    // Check the validity of the password

    if (!isPasswordValid(req.body.password)) {

        return res.status(400).json({
            message: validationMessages(req.body.password)
        });
    }

    // Email encryption

    const emailEncrypted = encrypt(req.body.email);

    // Hash of the password before saving the new user in the DB

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            db.User.create({
                    username: req.body.username,
                    email: emailEncrypted,
                    password: hash,
                    avatar: `${req.protocol}://${req.get('host')}/images/default-avatar.png`,
                    isAdmin: req.body.isAdmin
                })
                .then(() => res.status(201).json({
                    message: 'User created !'
                }))
                .catch(error => {
                    
                    const errorMessage = error.errors[0].message;

                    let errorMessageToSend;

                    if(errorMessage === 'username must be unique') {
                        errorMessageToSend = 'nickname already taken !';
                    } else if (errorMessage === 'email must be unique') {
                        errorMessageToSend = 'email already taken !';
                    } else {
                        errorMessageToSend = errorMessage;
                    }

                    res.status(400).json({
                        message: errorMessageToSend
                }
                )});

        })
        .catch(error => {
            res.status(500).json({
            message: error.message
        })});

};

// ********** User connection management **********
// *********************************************** *************

exports.signin = (req, res, next) => {

    // Retrieve the nickname from the DB

    db.User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {

            // Check the existence of the user

            if (user === null) {
                return res.status(404).json({
                    message: 'User not found !'
                });
            }

            // Comparison of the password entered by the user with the hashed password in the DB

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Wrong password !'
                        });
                    }
                    // Return the encoded token containing the userId
                    res.status(200).json({
                        userId: user.id,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            bio: user.bio,
                            avatar: user.avatar,
                            isAdmin: user.isAdmin
                        },
                        token: jwt.sign({
                                userId: user.id
                            },
                                process.env.TOKEN_SECRET_KEY, {
                                    expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    message: error.message
                }));

        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
};

// ********** Viewing a user's profile **********
// *********************************************** *************

exports.getUser = (req, res, next) => {

    // Retrieval from the database of user info corresponding to the id in the request

    db.User.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'username', 'email', 'bio', 'avatar']
        })
        .then(user => {

           // Check the existence of the user

            if (user === null) {
                return res.status(404).json({
                    message: 'User not found !'
                });
            }

            // Check user authorization

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Unauthorized request !'
                });
            }

            // Decrypt the DB email
            const emailDecrypted = decrypt(user.email);

            // Object with the data to return

            const userData = {
                id: user.id,
                username: user.username,
                email: emailDecrypted,
                bio: user.bio,
                avatar: user.avatar
            };

            res.status(200).json(userData);
        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            });
        });
};


// ********** Change password **********
// *********************************************** ********************

exports.updatePwdUser = (req, res, next) => {

    // Retrieval from the database of user info corresponding to the id in the request

    db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(user => {

            // Check the existence of the user

            if (user === null) {
                return res.status(404).json({
                    message: 'User not found !'
                });
            }

          // Check user authorization

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Unauthorized request!'
                });
            }

            // Check the validity of the new password

            if (!isPasswordValid(req.body.newPassword)) {

                return res.status(400).json({
                    message: validationMessages(req.body.newPassword)
                });
            }

            // Compare current password and DB password

            bcrypt.compare(req.body.currentPassword, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Incorrect current password !'
                        });
                    }

                    // Hash of the new password before saving in the DB

                    bcrypt.hash(req.body.newPassword, 10)
                        .then(hash => {

                            db.User.update({
                                    password: hash
                                }, {
                                    where: {
                                        id: req.params.id
                                    }
                                })
                                .then(() => res.status(200).json({
                                    message: 'Password updated!'
                                }))
                                .catch(error => res.status(400).json({
                                    message: error.message
                                }));

                        })
                        .catch(error => res.status(500).json({
                            message: error.message
                        }));

                    
                })
                .catch(error => res.status(500).json({
                    message: error.message
                }));

        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            });
        });
};

// ********** Delete a user **********
// *********************************************** **
exports.deleteUser = (req, res, next) => {

    db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(user => {

            // Check the existence of the user

            if (user === null) {
                return res.status(404).json({
                    message: 'User not found!'
                });
            }

            // Check user authorization

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Unauthorized request !'
                });
            }

            const filename = user.avatar.split('/images/')[1];

            if (filename !== 'default-avatar.png') {

                // Delete the image from the images folder
                
                fs.unlink(`images/${filename}`, error => {
                    if (error) throw error;
                    console.log('Profile picture deleted!');
                });

            }

            db.User.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Account deleted !`
                }))
                .catch(error => res.status(400).json({
                    message: error.message
                }));


        })
        .catch(error => {
            res.status(400).json({
                message: error.message
            });
        });

};

// ********** Update profile **********
// ******************************************

exports.updateUser = (req, res, next) => {

   // Bio length check
    
    const bio = req.file === undefined ? req.body.bio : JSON.parse(req.body.user).bio;

    if(bio !== null && bio.length > 255) {
        return res.status(400).json({
            message: 'Bio too long! 255 characters maximum !'
        });
    }
    
    // Retrieval from the database of user info corresponding to the id in the request
    db.User.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(user => {
           
           // Check the existence of the user

            if (user === null) {
                return res.status(404).json({
                    message: 'User not found !'
                });
            }

            // Check user authorization

            if (req.auth.userId !== user.id) {
                return res.status(403).json({
                    message: 'Unauthorized request !'
                });
            }

            // Check presence of image in the request

            let userObj;

            if (req.file) {

                // Check the validity of the nickname

                if (!isUsernameValid(req.body.user.username)) {
                    return res.status(400).json({
                        message: "Invalid username: must start with a letter and contain between 3 and 30 alphanumeric characters"
                    });
                }

                const filename = user.avatar.split('/images/')[1];

                if (filename !== 'default-avatar.png') {

                   // Delete the old image from the images folder
                    
                    fs.unlink(`images/${filename}`, error => {
                        if (error) throw error;
                        console.log('Old profile picture deleted !');
                    });

                }

               // Process the object with new image

                userObj = {
                    ...JSON.parse(req.body.user),
                    avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };

            } else {

                // Check the validation of the nickname

                if (!isUsernameValid(req.body.username)) {
                    return res.status(400).json({
                        message: "Invalid username: must start with a letter and contain between 3 and 30 alphanumeric characters"
                    });
                }
                
               // Recover data without image loading

                userObj = { ...req.body };

            }

            // Update user profile

            db.User.update({
                ...userObj
            }, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => res.status(200).json({
                message: 'Profile updated !',
                updatedData: userObj
            }))
            .catch(error => {
                    
                const errorMessage = error.errors[0].message;

                let errorMessageToSend;

                if(errorMessage === 'username must be unique') {
                    errorMessageToSend = 'nickname already taken !';
                } else {
                    errorMessageToSend = errorMessage;
                }

                res.status(400).json({
                    message: errorMessageToSend,
                    error: error
            }
            )});

        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            });
        });
};