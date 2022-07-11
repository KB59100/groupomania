const { addUser } = require("./models/modelUsers");

try {
  const user = {
    userName: "username",
    password: "password",
    email: "email@email.com",
  };
  addUser(user);
} catch (e) {
  console.error(e)
}
