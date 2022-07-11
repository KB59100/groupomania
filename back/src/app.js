require("dotenv").config();
const express = require("express");
const cors = require("cors");
const messages = require("../data/messages.json");
const usersData = require("../data/users.json");
const { addUser, login, deleteUser } = require("../controllers/userCtrl");

const app = express();

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Création du user
app.post("/users", addUser);
app.post("/login", login);
//Supprimer un user
app.delete("/users/:id", deleteUser);

//Récupère un user
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  try {
    usersData.users.forEach((user) => {
      if (user.id === id) {
        usersData.users.push(user);
      }
    });
    res.status(200).json(usersData.users);
  } catch (e) {
    res.status(500);
  }
});

//Mise a jour d'un user
app.put("/users/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    usersData.users.forEach((user) => {
      if (user.id === id) {
        user.userName = body.userName;
        user.email = body.email;
      }
    });
    res.status(200).json(usersData);
  } catch (e) {
    res.status(500);
  }
});



//Récupère tous les msg
app.get("/messages", (req, res) => {
  if (messages.messages.length === 0) {
    res.status(404).json({ error: "pas de messages" });
  }
  res.status(200).json(messages);
});

//Récupère un message
app.get("/messages/:id", (req, res) => {
  const id = req.params.id;
  const localMessage = [];

  messages.messages.forEach((message) => {
    if (message.id === id) {
      localMessage.push(message);
    }
  });

  if (localMessage.length === 0) {
    res.status(404).json({ error: `le message avec l'id ${id} n'existe pas` });
  }
  res.status(200).json(localMessage[0]);
});

//création du msg
app.post("/messages", (req, res) => {
  const body = req.body;

  try {
    messages.messages.push(body);
    res.status(200).json(messages);
  } catch (e) {
    res.status(500);
  }
});

//edite un msg
app.put("/messages/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const localMessage = [];

  try {
    messages.messages.forEach((message) => {
      if (message.id === id) {
        message.titre = body.titre;
        message.message = body.message;
        localMessage.push(message);
      }
    });
    res.status(200).json(localMessage);
  } catch (e) {
    res.status(500);
  }
});

//Supprimer un msg
app.delete("/messages/:id", (req, res) => {
  const id = req.params.id;

  try {
    messages.messages.forEach((message, index) => {
      if (message.id === id) {
        messages.messages.splice(index, 1);
      }
    });
    res.status(200).json(messages);
  } catch (e) {
    res.status(500);
  }
});

//Création d'un commentaire associé a un msg
app.post("/messages/:id/commentaires", (req, res) => {
  const messageId = req.params.id;
  const localMessage = [];

  messages.messages.forEach((message) => {
    if (message.id === messageId) {
      message.commentaires.push(req.body);
      localMessage.push(message);
    }
  });
  res.status(200).json(localMessage);
});

//Mise a jour d'un commentaire
app.put("/messages/:messagesid/commentaires/:commentairesid", (req, res) => {
  const id = req.params.messagesid;
  const id1 = req.params.commentairesid;
  const body = req.body;
  const message = messages.messages.find((m) => {
    return m.id === id;
  });
  if (!message) {
    return res.status(404).send();
  }

  message.commentaires.forEach((message) => {
    if (message.id === id1) {
      message.commentaire = body.message;
    }
  });
  res.status(200).json(messages);
});

//Récupère tous les commentaires d'un msg
app.get("/messages/:id/commentaires", (req, res) => {
  const id = req.params.id;
  const localCom = [];

  messages.messages.forEach((message) => {
    if (message.id === id) {
      localCom.push(message);
    }
  });

  if (localCom.length === 0) {
    res.status(404).json({ error: `pas de commentaires` });
  }
  res.status(200).json(localCom);
});

//Supprime un commentaire d'un msg
app.delete("/messages/:messageId/commentaires/:commentaireId", (req, res) => {
  const { commentaireId, messageId } = req.params;

  try {
    const newMessages = messages.messages.map((message) => {
      return message.id === messageId
        ? {
            commentaires: message.commentaires.filter(
              (commentaire) => commentaire.id !== commentaireId
            ),
            id: messageId,
          }
        : message;
    });
    res.status(200).json(newMessages);
  } catch (e) {
    console.log(e);
    res.status(500).send(); // permet d'envoyer une réponse avec le statut 500
  }
});

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port 3000!")
);
