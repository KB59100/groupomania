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
function add(user) {
  db.prepare(
    /*sql*/ `INSERT INTO user (user_name, email, password) VALUES (@userName, @email, @password)`
  ).run(user);
}

/**
 * [getByEmail description]
 *
 * @param   {String}  email  [email description]
 *
 * @return  {Object}         [return description]
 */
function getByEmail(email) {
  return db
    .prepare(/*sql*/ `SELECT * FROM user WHERE email=@email`)
    .get({ email });
}

function deleteUser(email) {
  return db.prepare(`DELETE FROM user WHERE email=@email`).get({ email });
}

module.exports = {
  add,
  getByEmail,
  deleteUser,
};
