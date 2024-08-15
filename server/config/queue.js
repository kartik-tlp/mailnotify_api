const Mail = require("../config/genricFunction/nodemailer");
const redis = require("../config/redisConnection")


 async function sendQueueMail (data) {
    try {

        // Process the queue continuously
        while (1) {
            console.log("Waiting for new email in the queue...");

            // Block until an item is available in the queue, then pop from the right
            const {element} = await redis.brPop("queue:email", 0);
            // console.log("result",result);

            // const element = result[0]; // result contains [key, element]
            console.log("element",element);
            
            const emailData = JSON.parse(element);
            
            console.log("Processing email data:", emailData);

            // Call sendMail function with the email data
            const sendMail = Mail.sendmail(emailData);
            console.log("sendMail",sendMail);
            

            console.log("Email sent successfully:", emailData);
        }
    } catch (error) {
        console.error("Error processing the email queue:", error);
    }
};
sendQueueMail()



