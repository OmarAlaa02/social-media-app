const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'social-media-app',
    password: 'AliSami14'
});

module.exports = pool.promise();