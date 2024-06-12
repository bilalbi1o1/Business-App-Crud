const mysql = require('mysql2/promise');

const con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '24525',
    database: 'projectData'
});

module.exports = con;