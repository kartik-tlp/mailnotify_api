
const Email = require("./controller/mailController")
const redis = require("./config/redisConnection")
const Master = require("./model/mailModel")


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
            const sendMail = await Email.sendmail(emailData);
            if (sendMail.status == 'success') {
                await Master.updateMailStatus({ status: "Sent", email_id: emailData.id });
                console.log("Email sent successfully:", emailData);
            } else {
              await Master.updateMailStatus({ status: "Failed", email_id: emailData.id });
              console.log("Email sent successfully:", emailData);

            }
        }
    } catch (error) {
        console.error("Error processing the email queue:", error);
    }
}



sendQueueMail()






