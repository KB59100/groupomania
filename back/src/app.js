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


app.get("/users", (req, res) => {
  const userId = req.params.userId;

  usersData.users.forEach((userId) => {
    if (userId.id === userId) {
      userId.push(userId);
    }
  });
    res.status(200).json(userId);
  }
);

app.post("/users", (req, res) => {
  const body = req.body;

  usersData.userId.push(body);
  res.status(200).json(usersData);
});
 
app.delete("/users", (req, res) => {
  const userId = req.params.userId;

  usersData.users.forEach((userId, index) => {
    if (userId.id === userId) {
      usersData.userId.splice(index, 1);
    }
  });
  res.status(200).json(userId);
});


app.get('/messages', (req, res) => {
  if(messages.messages.lenght === 0) {
    res.status(404).json({error: "pas de messages"})
  }
  res.status(200).json(messages);
});

app.get("/messages/:id", (req, res) => {

  const id = req.params.id;
  const message = [];

  messages.messages.forEach((message) => {
    if(message.id === id) {
      message.push(message);
    }
  })

  if(message.length === 0) {
    res.status(404).json({error: `le message avec l'id ${id} n'existe pas`});

    res.status(200).json(message[0]);
  }
});

app.post('/messages', (req, res) => {
  const body = req.body;

  messages.messages.push(body);
  res.status(200).json(messages);
});

app.put('/messages/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const message = [];

    messages.messages.forEach((message) => {
      if (message.id === id) {
        message.titre = body.titre;
        message.message = body.message;
        message.push(message);
      }
    })
    res.status(200).json(message);
})

app.delete('/messages/:id', (req, res) => {
  const id = req.params.id;

      messages.messages.forEach((message, index) => {
      if (message.id === id) {
        messages.messages.splice(index, 1)
      }
    })
    res.status(200).json(messages);
})

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

app.get("/messages/:id/commentaires", (req, res) => {
  const id = req.params.id;
  const message = [];

  messages.messages.forEach((message) => {
    if (message.id === id) {
      message.push(message);
    }
  });

  if (message.length != 0) {
    res.status(404).json({ error: `le message avec l'id ${id} à bien été ajouté` });

    res.status(200).json(message[0]);
  }
});

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
