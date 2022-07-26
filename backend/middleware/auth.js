const jwt = require('jsonwebtoken');

// Verification of authentication before sending the request

module.exports = (req, res, next) => {
    try {

        // Retrieve the userId from the decoded token

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const userId = decodedToken.userId;

        // Save the userId in the request object

        req.auth = { userId };

        // Verification of the correspondence of the userId of the token with the userId of the request

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID invalid !';
        } else {
            next();
        }
    } catch (error) {

        if(error.message === 'jwt expired') {
            messageToSend = "Authentication failed: session expired";
        } else {
            messageToSend = "Authentication Failure";
        }

        res.status(401).json({
            message: messageToSend,
            error: error
        });
    }
};