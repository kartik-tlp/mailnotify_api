const db = require("../config/db")
const moment = require("moment")

var Mail = function(){

}

Mail.updateMailStatus = function (postData) {
    // console.log("postData",postData);
    console.log("status->",postData);
    

    return new Promise(function (resolve, reject) {
        const nowDate =  moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

        const updatedValue = {
            status : postData.status || '',
            updated_on : nowDate
        }

        const queryString = "UPDATE ??  SET ? WHERE id = ?"
        const values = ["user_email_data",updatedValue,postData.email_id]
        db.query(queryString,values, function (error, response) {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })



    })
}

module.exports = Mail