
const mysql = require('mysql');


/* connection = mysql.createConnection({
    host: 'antares-art2.chgwjzemkidi.us-east-2.rds.amazonaws.com',
    port:  '3306',
    user: 'root',
    password: 'wbfwwejhbfw',
    database: 'antares'
});  */

 connection = mysql.createConnection({
    host: 'localhost',
    port:  '3306',
    user: 'root',
    password: '123456',
    database: 'antares'
}); 

module.exports = connection;