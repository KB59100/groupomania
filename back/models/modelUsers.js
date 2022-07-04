const { createTable, db } = require("../services/database");

const table = /*sql*/ `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
`;

createTable("user", table);

/**
 * [addUser description]
 *
 * @param   {Object}  user
 * @param   {String}  user.userName  [userName description]
 * @param   {String}  user.email     [email description]
 * @param   {String}  user.password  un mot de passe cruypté
 *
 * @return  {void}            [return description]
 */
function addUser(user) {
  db.prepare(
    /*sql*/ `INSERT INTO user (user_name, email, password) VALUES (@userName, @email, @password)`
  ).run(user);
}

//addUser({ userName: "Momo", email: "momo@gmail.com", password: "1234" });

module.exports = {
    addUser
}