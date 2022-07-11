const { createTable, db } = require("../services/database");

const TABLE_NAME = "messages";
// A FAIRE AJOUTER LES ATTRIBUTS MANQUANTS + CLE ETRANGER USERID et MESSAGEID
const table = /*sql*/ `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
`;

createTable(TABLE_NAME, table);

function add(commentaire) {
  db.prepare(
    /*sql*/ `INSERT INTO ${TABLE_NAME} (titre, message, date) VALUES (@titre, @message, @date)`
  ).run(commentaire);
}

function deleteCommentaire(messageId) {
  db.prepare(/*sql*/ `DELETE FROM ${TABLE_NAME} WHERE id=@id`).run({
    messageId,
  });
}
// A FAIRE AJOUTER LA FONCTION POUR METTRE A JOUR UN COMMENTAIRE
module.exports = { add, deleteCommentaire };
