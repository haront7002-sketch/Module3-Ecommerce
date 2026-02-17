const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Twana@2005', 
    database: 'south_of_somewhere'
});

module.exports = pool;
