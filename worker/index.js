
const Email = require("./controller/mailController")
const redis = require("./config/redisConnection")
const Master = require("./model/mailModel")


const sendQueueMail = async () => {
  while (true) {
      try {
          // Check the length of the email queue
          const queueLength = await redis.lLen("queue:email");

          if (queueLength === 0) {
              console.log("Waiting for new emails in the queue...");
          } else {
              console.log(`Sending emails left in the queue (${queueLength})...`);
          }

          // Block until an item is available in the queue and pop from the right
          const { element } = await redis.brPop("queue:email", 0);
          const emailData = JSON.parse(element);

          try {
              // Attempt to send the email
              const sendMail = await Email.sendmail(emailData);
              
              if (sendMail.status == 'success') {
                  await Master.updateMailStatus({ status: "Sent", email_id: emailData.id });
                  console.log("Email sent successfully:", emailData);
              } else {
                  await Master.updateMailStatus({ status: "Failed", email_id: emailData.id });
                  console.error("Failed to send email:", emailData);
              }
          } catch (sendError) {
              console.error("Error sending email:", sendError);
              await Master.updateMailStatus({ status: "Failed", email_id: emailData.id });
          }

      } catch (queueError) {
          console.error("Error processing the email queue:", queueError);
      }
  }
};




sendQueueMail()






