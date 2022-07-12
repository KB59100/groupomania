const { createTable, db, updateById } = require("../services/database");

const TABLE_NAME = "messages";
// A FAIRE AJOUTER LA CLE ETRANGER USERID
const table = /*sql*/ `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    titre TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    likes JSON NOT NULL DEFAULT [],
`;

createTable(TABLE_NAME, table);

function add(message) {
  db.prepare(
    /*sql*/ `INSERT INTO ${TABLE_NAME} (titre, message, date) VALUES (@titre, @message, @date)`
  ).run(message);
}

function deteleteMessage(messageId) {
  db.prepare(/*sql*/ `DELETE FROM ${TABLE_NAME} WHERE id=@id`).run({
    messageId,
  });
}

/**
 * modifie un commentaire
 *
 * @param   {Object}  message
 * @param   {Number}  message.id
 * @param   {String}  [message.titre]
 * @param   {String}  [message.message]
 * @param   {Array}  [message.likes]
 *
 * @return  {void}           [return description]
 */
function update(message) {
  updateById(TABLE_NAME, message);
}

/**
 * [handleLikes description]
 *
 * @param   {Number}  messageId  [messageId description]
 * @param   {Number}  userId     [userId description]
 * @param   {Boolean}  like       [like description]
 *
 * @return  {void}             [return description]
 */
function handleLikes(messageId, userId, like) {
  const message = db
    .prepare(/*sql*/ `SELECT likes FROM ${TABLE_NAME} WHERE id=@messageId`)
    .get({ messageId });
  const index = message.likes.indexOf(userId);
  let save = false;
  if (index !== -1 && !like) {
    message.likes.splice(index, 1);
    save = true;
  }
  if (index === -1 && like) {
    message.likes.push(userId);
    save = true;
  }
  if (save) {
    update({ id: messageId, likes: message.likes });
  }
}

// A FAIRE LA FONCTION POUR METTRE A JOUR LE MESSAGE

module.exports = { add, deteleteMessage, update, handleLikes };
