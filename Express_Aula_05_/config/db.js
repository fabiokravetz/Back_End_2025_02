const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'fukuda', 
  database: 'farmacia',
  connectionLimit: 10,
});

module.exports = pool;