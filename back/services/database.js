
const db = require("better-sqlite3")(__dirname+"/../data/database.db", {
  fileMustExist: true,
});

function createTable(name, structure) {
  try {
    db.exec(/*sql*/ `SELECT id FROM ${name};`);
  } catch (error) {
    db.exec(/*sql*/ `CREATE TABLE ${name} (${structure});`);
  }
}

module.exports = {
  createTable,
  db,
};
