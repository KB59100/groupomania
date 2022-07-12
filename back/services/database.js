
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

function updateById(table, data){
  let values = "";
  for (const key of Object.keys(data)) {
    if (key === "id") continue;
    if (values.length > 0) values+= ","
    values += ` ${key}=@${key}`;
  }
  db
    .prepare(/*sql*/ `UPDATE ${table} SET ${values} WHERE id=@id`)
    .run(data)
}

module.exports = {
  createTable,
  db,
  updateById
};
