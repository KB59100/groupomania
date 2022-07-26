const fs = require('fs');
const db = require('../models');

// ********** Create a POST **********
// ****************************************
exports.createPost = (req, res, next) => {

    // Check  of image in the request

    let postObj;

    if (req.file) {

        const content = JSON.parse(req.body.post).content.trim();

       // Validation of message content when there is an image

        if (content !== '' && content.length < 2) {
            return res.status(400).json({
                message: "The message must contain at least two characters"
            });
        }

        postObj = {
            content: content,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };

    } else {
        
        const content = req.body.content.trim();

        // Validation of message content when there is no image
        
        if (content.length < 2) {
            return res.status(400).json({
                message: "The message must contain at least two characters"
            });
        }

        postObj = { content: content, imageUrl: null };
    }
  
   // Save the post in the DB
  
    db.Post.create({
        userId: req.auth.userId,
        content: postObj.content,
        imageUrl: postObj.imageUrl
    })
    .then(() => res.status(201).json({
        message: 'Post created successfully !'
    }))
    .catch(error => {
        res.status(400).json({
            message: error.message
        })
    });
  };

// ********** Get all POSTS **********
// *********************************************** ****

exports.getAllPosts = (req, res, next) => {
    
    db.Post.findAll({
        order: [['createdAt', 'DESC'], [db.Comment, 'createdAt', 'ASC' ], [db.Like, 'createdAt', 'ASC' ]],
        attributes: ['id', 'content', 'imageUrl', 'createdAt', 'updatedAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: db.Comment,
                attributes: ['id', 'content', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            },
            {
                model: db.Like,
                attributes: ['id', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })
    .then(posts => {
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: 'Error geting posts' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });

};

// ********** Get one  POST **********
// *********************************************

exports.getOnePost = (req, res, next) => {
    
    db.Post.findOne({
        where: {
            id: req.params.id
        },
        order: [[db.Comment, 'createdAt', 'ASC' ], [db.Like, 'createdAt', 'ASC' ]],
        attributes: ['id', 'content', 'imageUrl', 'createdAt', 'updatedAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: db.Comment,
                attributes: ['id', 'content'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            },
            {
                model: db.Like,
                attributes: ['id', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })
    .then(post => {
        // Check the existence of the post

        if (post === null) {
            return res.status(404).json({
                message: 'post not found !'
            });
        }
        res.status(200).json(post);
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });

};

// ********** Get Users POSTS **********
// *********************************************** *************

exports.getMyPosts = (req, res, next) => {
    
    db.Post.findAll({
        where: {
            userId: req.auth.userId
        },
        order: [['createdAt', 'DESC'], [db.Comment, 'createdAt', 'ASC' ], [db.Like, 'createdAt', 'ASC' ]],
        attributes: ['id', 'content', 'imageUrl', 'createdAt', 'updatedAt'],
        include: [
            {
                model: db.User,
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: db.Comment,
                attributes: ['id', 'content', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            },
            {
                model: db.Like,
                attributes: ['id', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })
    .then(posts => {
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: 'Error retrieving posts' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });

};

// ********** Deleting a POST ***********
// *********************************************

exports.deletePost = (req, res, next) => {
    
    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {

       // Check the existence of the post

        if (post === null) {
            return res.status(404).json({
                message: 'post not found !'
            });
        }

        // Check if user = post creator or admin

        db.User.findOne({
            where: {
                id: req.auth.userId
            }
        })
        .then(user => { 
            
            if (req.auth.userId === post.userId || user.isAdmin ) {

                // Delete the image from the images folder (if image present)

                if(post.imageUrl !== null) {
                    const filename = post.imageUrl.split('/images/')[1];
            
                    fs.unlink(`images/${filename}`, error => {
                        if (error) throw error;
                        console.log('Post image deleted!');
                    });
                }

                // Delete the post from the db

                db.Post.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Post deleted!`
                }))
                .catch(error => res.status(400).json({
                    error,
                    message: error.message
                }));

            } else {
                return res.status(403).json({
                    message: 'Unauthorized request!'
                });
            }

        })
        .catch(error => {
            res.status(400).json({
                message: error.message
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

 // ********** Modification of a POST ***********
// **********************************************

exports.updatePost = (req, res, next) => {
    
   // Validation of message content

    const content = req.file === undefined ? req.body.content.trim() : JSON.parse(req.body.post).content.trim();

    // 2 scenarios
    // case 1: image in the post AND message length = 1 character (0 is allowed)
    // case 2: no image in the post AND message length less than 2 characters

    if (((req.file || req.body.keepPreviousImg) && content.length === 1) || (!req.file && !req.body.keepPreviousImg && content.length < 2)) {
        return res.status(400).json({
            message: "The message must contain at least two characters"
        });
    }
    
    db.Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(post => {

        // Check the existence of the post

        if (post === null) {
            return res.status(404).json({
                message: 'post not found !'
            });
        }

       // Check if user = post creator

        if (req.auth.userId !== post.userId) {
            return res.status(403).json({
                message: 'Unauthorized request !'
            });
        }

        // Delete the old image from the images folder if it exists
        
        // Condition = there was already an image AND (we have a new image uploaded or we want to delete the image)
        
        const deleteImg = req.body.deleteImg;
        
        if((post.imageUrl !== null) && (req.file ||  deleteImg)) {
                
            const filename = post.imageUrl.split('/images/')[1];

            fs.unlink(`images/${filename}`, error => {
                if (error) throw error;
                console.log('Old post image deleted !');
            });
        }
        
        // Check presence of image in the request

        let postObj;

        if (req.file) {

            // Process the object with new image

            const content = JSON.parse(req.body.post).content.trim();
            
            postObj = {
                content: content,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            };

        } else {
            
          // Process the object without uploaded image
            
            const content = req.body.content.trim();

            const imageUrl = deleteImg ? null : post.imageUrl;

            postObj = { 
                content: content,
                imageUrl: imageUrl
            };

        }

        // Update of the post in the db

        db.Post.update({
            ...postObj
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).json({
            message: 'Post updated !',
            updatedData: postObj
        }))
        .catch(error => {
            res.status(400).json({
                message: error.message,
                error: error
        }
        )});
        
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

 };
