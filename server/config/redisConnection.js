const { createClient } = require("redis");
require("dotenv").config({ path: "./.env" })

const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.connect().then(() => {
    console.log("Connected to Redis.");
}).catch((err) => {
    console.error("Failed to connect to Redis:", err);
});

// redis.connect(function (err) {

//     if (!err) {
//         console.log("Redis is connected")
//     }
//     else if (err) {
//         throw new Error("Couldn't connect", err)
//     }

//     // throw new Error('database failed to connect');
// });

module.exports = redis