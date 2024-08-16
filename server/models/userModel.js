const db = require("../config/db")
const moment = require("moment")


var User = function () {

}

User.addUserMailData = function (postData) {

    return new Promise(function (resolve, reject) {
        const nowDate =  moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

        const insertedData = {
            receiver_mail : postData.to || '',
            sender_mail : process.env.SMTP_MAIl,
            subject : postData.mailsubject || '',
            content : postData.content || '',
            status :  'Pending',
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

User.getEmailStatus = function (postData) {

    return new Promise(function (resolve, reject) {

        var whereCondition = ''

        if(postData.emailId){
            whereCondition += `AND(id = '${postData.emailId}')`
        }
        if(postData.status){
            whereCondition += `AND(status = '${postData.status}')`
        }

        var queryString = `SELECT id,receiver_mail, status FROM  user_email_data WHERE 1 = 1 ${whereCondition}`

        db.query(queryString, function (error, response) {
            if (error) {
                reject(error)
                
            } else {
                resolve(response)
            }
        })



    })
}

User.getMailData = function(postData){
    // console.log("postdata",postData);
    return new Promise(function(resolve,reject){
        const queryString = "SELECT * FROM user_email_data WHERE id = ? "
        const value = [postData.emailId]
        db.query(queryString,value,function(err,res){
            if(err){
                reject(err)
            }else{
                 var data = {}
                if(res.length){ 
                    data = res[0]
                    resolve(data)
                }
                resolve(data)
            }
        })
    })
}





module.exports = User