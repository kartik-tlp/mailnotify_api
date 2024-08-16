const express = require("express")
const http = require('http');
const router = require("./routes/index")
const socketIo = require('socket.io');
require("dotenv").config({ path: "./.env" })

const app = express()
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json())

app.use('/api', router)

app.get('/', function (req,res) {
    res.send('Api is Working ')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.send('404 error :: Invalid Tokens');
});

// Socket.io connection handling
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// const PORT =  3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = io;
module.exports = app