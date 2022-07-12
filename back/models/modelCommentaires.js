const { createTable, db } = require("../services/database");

const TABLE_NAME = "messages";
// A FAIRE AJOUTER LES ATTRIBUTS MANQUANTS + CLE ETRANGER USERID et MESSAGEID
const table = /*sql*/ `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOY NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    message_id INTEGER NOY NULL,
`;

createTable(TABLE_NAME, table);

/**
 * ajoute un commentaire
 *
 * @param   {Object}  commentaire
 * @param   {String}  commentaire.titre
 * @param   {String}  commentaire.message
 * @param   {String}  commentaire.date
 * @param   {Number}  commentaire.userId
 * @param   {Number}  commentaire.messageId
 *
 * @return  {void}               [return description]
 */
function add(commentaire) {
  db.prepare(
    /*sql*/ `INSERT INTO ${TABLE_NAME} (titre, message, date, user_id, message_id) VALUES (@titre, @message, @date, @userId, @messageId)`
  ).run(commentaire);
}

function deleteCommentaire(messageId) {
  db.prepare(/*sql*/ `DELETE FROM ${TABLE_NAME} WHERE id=@id`).run({
    messageId,
  });
}


// A FAIRE AJOUTER LA FONCTION POUR METTRE A JOUR UN COMMENTAIRE
module.exports = { add, deleteCommentaire };
