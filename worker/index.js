
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
            if (sendMail.status === 'success') {
                await Master.updateMailStatus({ status: "Sent", email_id: emailData.id });
                console.log("Email sent successfully:", emailData);
            } else {
                console.error("Failed to send email:", emailData);
            }
        }
    } catch (error) {
        console.error("Error processing the email queue:", error);
    }
}

// const sendQueueMail = async function sendQueueMail() {
//     try {
//       while (true) {
//         console.log("Waiting for new email in the queue...");
  
//         // Block until an item is available in the queue, then pop from the right
//         const { element } = await redis.brPop("queue:email", 0);
//         const emailData = JSON.parse(element);
  
//         console.log("Processing email data:", emailData);
  
//         let success = false;
  
//         // Retry up to 3 times if sending fails
//         for (let retries = 3; retries > 0 && !success; retries--) {
//           try {
//             await Email.sendmail(emailData);
//             io.emit('status-update', { emailId: emailData.id, status: 'sent' });
//             success = true;
//             console.log("Email sent successfully:", emailData);
//           } catch (error) {
//             console.log(`Retrying... (${retries - 1} attempts left)`);
//             if (retries === 1) {
//               io.emit('status-update', { emailId: emailData.id, status: 'failed' });
//               console.error("Failed to send email after retries:", emailData);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error processing the email queue:", error);
//     }
//   }
  

sendQueueMail()






