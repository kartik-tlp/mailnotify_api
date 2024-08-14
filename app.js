const express = require("express")
const router = require("./routes/index")
require("dotenv").config({ path: "./.env" })

const app = express()
app.use(express.json())

app.use('/api', router)

app.get('/', function (req,res) {
    res.send('Api is Working ')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.send('404 error :: Invalid Tokens');
});

module.exports = app