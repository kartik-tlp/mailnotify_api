const Mail = require("../config/genricFunction/nodemailer")
const db = require("../config/db")
const User = require("../models/userModel")

exports.addUserMailData = async function (req, res) {
    try {
        db.beginTransaction()
        // const sendMail = await Mail.sendmail(req.body)
        // console.log("sendMail",sendMail);
        const addUserMailData = await User.addUserMailData(req.body)

        if(addUserMailData.insertId){
            db.commit()
            res.status(200).json({
                status : "success",
                message : "Mail Added in queue"
            })
        }else{
            db.rollback()
            res.status(200).json({
                status : "failed",
                message : "Mail not added in queue"
            })
        }

    } catch (e) {
        db.rollback()
        var err = {
            code: e.code,
            sqlMessage: e.sqlMessage
        };
        res.status(200).json({
            message: "Error Occured",
            status: "error",
            err: err
        });
        return false;

    }
}