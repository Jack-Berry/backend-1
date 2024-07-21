const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "trivia",
});

connection.connect();

function asyncMySQL(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
}

module.exports = asyncMySQL;
