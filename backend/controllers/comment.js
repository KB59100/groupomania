const db = require('../models');

// ********** Create a COMMENT **********
// **********************************************

exports.createComment = (req, res, next) => {

    if (req.body.content.trim().length < 2) {
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

        // Save the comment in the DB

        db.Comment.create({
            userId: req.auth.userId,
            postId: post.id,
            content: req.body.content
        })
        .then(() => res.status(201).json({
            message: 'Comment added !'
        }))
        .catch(error => {
            res.status(400).json({
                message: error.message
            })
        });
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};


// ********** COMMENT UPDATE **********
// *********************************************** **

exports.updateComment = (req, res, next) => {

    if (req.body.content.trim().length < 2) {
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

        // Check post is it exist

        if (post === null) {
            return res.status(404).json({
                message: 'post not found !'
            });
        }

        db.Comment.findOne({
            where: {
                id: req.params.commentId
            }
        }).then(comment => {

            // Check the existence of the comment

            if (comment === null) {
                return res.status(404).json({
                    message: 'Comment not found !'
                });
            }

           // Check if user = creator of the comment

            if (req.auth.userId !== comment.userId) {
                return res.status(403).json({
                    message: "Request not allowed! You don't have the right to edit the comment!"
                });
            }

            // Update the comment in the DB

            db.Comment.update({
                content: req.body.content
            }, {
                where: {
                    id: req.params.commentId
                }
            })
            .then(() => res.status(200).json({
                message: 'Comment updated!'
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
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};


// ********** Deleting a COMMENT **********
// *********************************************** **

exports.deleteComment = (req, res, next) => {

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

        db.Comment.findOne({
            where: {
                id: req.params.commentId
            }
        }).then(comment => {

            // Check the existence of the comment

            if (comment === null) {
                return res.status(404).json({
                    message: 'Comment not found !'
                });
            }

            // Check if user = comment creator or admin

            db.User.findOne({
                where: {
                    id: req.auth.userId
                }
            }).then(user => {

                if (req.auth.userId === comment.userId || user.isAdmin ) {

                   // Delete the db comment
    
                    db.Comment.destroy({
                        where: {
                            id: req.params.commentId
                        }
                    })
                    .then(() => res.status(200).json({
                        message: `Comment deleted !`
                    }))
                    .catch(error => res.status(400).json({
                        message: error.message
                    }));
    
                } else {
                    return res.status(403).json({
                        message: "Request not allowed! You do not have the right to delete the comment"
                    });
                }

            })
            .catch(error => {
                res.status(404).json({
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
        
    })
    .catch(error => {
        res.status(404).json({
            message: error.message,
            error
        });
    });

};
