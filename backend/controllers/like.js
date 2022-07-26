const db = require('../models');

// ********** Management of the LIKE **********
// **********************************************

exports.like = (req, res, next) => {

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

       // Check if the user likes the post or not

        db.Like.findOne({
            where: {
                userId: req.auth.userId,
                postId: post.id
            }
        })
        .then(likeFound => {

            if (likeFound === null) {

                // Add a like

                db.Like.create({
                    userId: req.auth.userId,
                    postId: post.id
                })
                .then(() => res.status(201).json({
                    message: 'Like added !'
                }))
                .catch(error => {
                    res.status(400).json({
                        message: error.message
                    })
                });

            } else {

               // Delete a like
    
                db.Like.destroy({
                    where: {
                        userId: req.auth.userId,
                        postId: post.id
                    }
                })
                .then(() => res.status(200).json({
                    message: `Like removed !`
                }))
                .catch(error => res.status(400).json({
                    message: error.message
                }));
            }

        })
        .catch(error => {
            res.status(404).json({
                message: error.message,
                error
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



