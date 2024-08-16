const mysql = require('mysql');
require("dotenv").config({ path: "./.env" })

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
});

connection.connect(function (err) {
    // console.log('db_host', process.env.DB_HOST)
    if (!err) {
        console.log("db is connected")
    }
    else if (err) {
        throw new Error("Couldn't connect", err)
    }

    // throw new Error('database failed to connect');
});


module.exports = connection;