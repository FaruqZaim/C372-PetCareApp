const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ENTER_YOUR_MYSQL_PASSWORD',
  database: 'petcare'
});

module.exports = connection;
