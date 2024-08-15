
const Mail = require("../server/config/genricFunction/nodemailer")
const redis = require("../server/config/redisConnection")
const User = require("../server/models/userModel")
// const db = require("../server/config/db")
// require("dotenv").config({ path: "./.env" })
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });




// async function sendQueueMail() {
//     try {

//         // Process the queue continuously
//         while (1) {
//             const queueLength = await redis.lLen("queue:email");

//             if (queueLength === 0) {
//                 console.log("Waiting for new email in the queue...");
//             } else {
//                 console.log(`Sending emails left in queue (${queueLength})...`);
//             }

//             // Block until an item is available in the queue, then pop from the right
//             const { element } = await redis.brPop("queue:email", 0);

//             const emailData = JSON.parse(element);

//             const sendMail = await Mail.sendmail(emailData);
//             if (sendMail.status == 'success') {
//                 const UpdateMailStatus = await User.updateMailStatus({ status: "Sent", email_id: emailData.id })
//                 console.log("UpdateMailStatus", UpdateMailStatus);

//             }

//             console.log("Email sent successfully:", emailData);
//         }
//     } catch (error) {
//         console.error("Error processing the email queue:", error);
//     }
// };


const sendQueueMail = async function () {
    try {
        // Process the queue continuously
        while (true) {
            const queueLength = await redis.lLen("queue:email");

            if (queueLength === 0) {
                console.log("Waiting for new email in the queue...");
            } else {
                console.log(`Sending emails left in queue (${queueLength})...`);
            }

            // Block until an item is available in the queue, then pop from the right
            const {element} = await redis.brPop("queue:email", 0);

            const emailData = JSON.parse(element);

            // Attempt to send the email
            const sendMail = await Mail.sendmail(emailData);
            if (sendMail.status === 'success') {
                await User.updateMailStatus({ status: "Sent", email_id: emailData.id });
                console.log("Email sent successfully:", emailData);
            } else {
                console.error("Failed to send email:", emailData);
            }
        }
    } catch (error) {
        console.error("Error processing the email queue:", error);
    }
}




sendQueueMail()






