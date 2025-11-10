const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',       
    user: 'root',            
    password: 'fukuda', 
    database: 'aula_login_express',
    connectionLimit: 10,
});

console.log("Pool de conexões com MySQL criado.");

module.exports = pool;