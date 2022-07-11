const { createTable, db } = require("../services/database");

const TABLE_NAME = "messages";
// A FAIRE AJOUTER LA CLE ETRANGER USERID 
const table = /*sql*/ `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
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

// A FAIRE LA FONCTION POUR METTRE A JOUR LE MESSAGE

module.exports = { add, deteleteMessage };
