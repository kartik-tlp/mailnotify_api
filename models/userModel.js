const db = require("../config/db")
const moment = require("moment")


var User = function () {

}

User.addUserMailData = function (postData) {

    return new Promise(function (resolve, reject) {
        const nowDate =  moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

        const insertedData = {
            receiver_mail : postData.to || '',
            subject : postData.mailsubject || '',
            content : postData.content || '',
            created_on : nowDate,
            updated_on : nowDate
            
        }

        const queryString = "INSERT INTO user_email_data SET ?"
        db.query(queryString, insertedData, function (error, response) {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })



    })
}

module.exports = User