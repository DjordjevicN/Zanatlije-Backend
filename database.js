const mysql = require('mysql')
// Database
// module.exports = mysql.createConnection({
//     user: process.env.DATABASE_USERNAME,
//     host: 'localhost',
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME
// })

module.exports = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'vrtirep_zanatlije'
})

