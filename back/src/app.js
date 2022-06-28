import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import messages from '../data/messages';
import usersData from '../data/users';

 
const app = express();

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





//Création du user
app.post('/users', (req, res) => {
   try {
     const body = req.body;
     usersData.users.push(body);
     res.status(200).json(usersData);
   } catch (e) {
     res.status(500);
   }
});

//Récupère tous les users
app.get('/users', (req, res) => {
    res.status(200).json(usersData.users);
  }
);

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
app.put('/users/:id', (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try{
  usersData.users.forEach((user) => {
    if (user.id === id) {
      user.userName = body.userName;
      user.email = body.email;
    }
  })
  res.status(200).json(usersData);
  } catch (e) {
    res.status(500);
  }

})
 
//Supprimer un user
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  try{
  usersData.users.forEach((user, index) => {
    if (user.id === userId) {
      usersData.users.splice(index, 1);
    }
  });
  res.status(200).json(usersData.users);
 } catch (e) {
     res.status(500);
   }
});





//Récupère tous les msg
app.get('/messages', (req, res) => {
  if(messages.messages.lenght === 0) {
    res.status(404).json({error: "pas de messages"})
  }
  res.status(200).json(messages);
});

//Récupère un message
app.get("/messages/:id", (req, res) => {

  const id = req.params.id;
  const localMessage = [];

  messages.messages.forEach((message) => {
    if(message.id === id) {
      localMessage.push(message);
    }
  })

  if(localMessage.length === 0) {
    res.status(404).json({error: `le message avec l'id ${id} n'existe pas`});
  }
  res.status(200).json(localMessage[0]);
});

//edite un msg
app.post('/messages', (req, res) => {
  const body = req.body;

  try{
  messages.messages.push(body);
  res.status(200).json(messages);
  } catch (e) {
    res.status(500);
  }
});

//création du msg
app.put('/messages/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const localMessage = [];

  try{
    messages.messages.forEach((message) => {
      if (message.id === id) {
        message.titre = body.titre;
        message.messages = body.message;
        localMessage.push(message);
      }
    })
    res.status(200).json(localMessage);
    } catch (e) {
      res.status(500);
    }
})

//Supprimer un msg
app.delete('/messages/:id', (req, res) => {
  const id = req.params.id;
      
  try{
      messages.messages.forEach((message, index) => {
      if (message.id === id) {
        messages.messages.splice(index, 1)
      }
    })
    res.status(200).json(messages);
    } catch (e) {
      res.status(500);
    }

})




//création d'un commentaire associé a un msg
app.put('/messages/:id/commentaires', (req, res) => {
  const messageId = req.params.id;
  const body = req.body;
  const localCom = [];

  try{
    messages.messages.forEach((message) => {
      if (message.id === messageId) {
        message.commentaires = body.commentaires;
        localCom.push(message);
      }
    })
    res.status(200).json(localCom);
    } catch (e) {
      res.status(500); 
    }
})

//Edite met a jour un commentaire
app.post('/messages/:id/commentaires', (req, res) => {
   const messageId = req.params.id;
   const localMessage = [];

   messages.messages.forEach((message) => {
    if(message.id === messageId) {
      message.commentaires.push(req.body);
      localMessage.push(message);
    } 
   })
    res.status(200).json(localMessage);
})

//Récupère tous les commentaires d'un msg
app.get("/messages/:id/commentaires", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const localCom = [];


})

//Supprime un commentaire d'un msg
app.delete("/messages/:id/commentaires", (req, res) => {
  const id = req.params.id;

  messages.messages.forEach((commentaires, index) => {
    if (commentaires.id === id) {
      commentaires.messages.splice(index, 1);
    }
  });
  res.status(200).json(messages);
});





app.listen(process.env.PORT, () =>
  console.log('Example app listening on port 3000!'),
);
