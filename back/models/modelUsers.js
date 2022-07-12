const { createTable, db } = require("../services/database");

/**
 * roles
 * 0 : utilisateur
 * 1 : admin
 */

const table = /*sql*/ `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role INTEGER NOT NULL DEFAULT 0
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

function deleteUser(id) {
  return db.prepare(`DELETE FROM "user" WHERE id=@id`).run({ id });
}

function getRoleById(id) {
  return db.prepare(/*sql*/ `SELECT role FROM "user" WHERE id=@id`).get({ id });
}

module.exports = {
  add,
  getByEmail,
  getRoleById,
  deleteUser,
};
