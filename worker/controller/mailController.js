const nodemailer = require("nodemailer")
require("dotenv").config({ path: "./.env" })

exports.sendmail = async function (postData) {
    
    return new Promise(function (resolve, reject) {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const mailoptions = {
            from: postData.sender_mail,
            to: postData.receiver_mail,
            subject: postData.subject,
            html: postData.content,
        }
        transport.sendMail(mailoptions, function (err, info) {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                // console.log("Mail sent successfully :- ", info.response)
                resolve({
                    status: "success",
                    response: info.response
                })
            }
        })
    })

}

