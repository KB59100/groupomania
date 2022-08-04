const jwt = require("jsonwebtoken");

// Vérification de l'authentification avant l'envoi de la demande

module.exports = (req, res, next) => {
  try {
    //Récupérer l'userId du décodétoken

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;

    // Enregistrez l'ID utilisateur dans l'objet de requête

    req.auth = { userId };

    // Vérification de la correspondance de l'userId du token avec l'userId de la requête

    if (req.body.userId && req.body.userId !== userId) {
      throw "ID utilisateur invalide!";
    } else {
      next();
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      messageToSend = "Échec de l'authentification: session expirée";
    } else {
      messageToSend = "Échec de l'authentification";
    }

    res.status(401).json({
      message: messageToSend,
      error: error,
    });
  }
};
