
const db = require("../config/db")
const redis = require("../config/redisConnection")
const User = require("../models/userModel")



exports.addUserMailData = async function (req, res) {
    try {
        db.beginTransaction()

        const addUserMailData = await User.addUserMailData(req.body)

        if (addUserMailData.insertId) {
            db.commit()
            res.status(200).json({
                status: "success",
                email_status: "pending",
                message: "Email composed successfully'"
            })
        } else {
            db.rollback()
            res.status(200).json({
                status: "failed",
                message: "Error composing email"
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

exports.sendMail = async function (req, res) {
    try {

        const getMailData = await User.getMailData(req.body)
        if (getMailData.id) {
            // Pushing to the queue -- from the left
            redis.lPush("queue:email", JSON.stringify(getMailData));

            const queueItems = await redis.lRange('queue:email', 0, -1);
            console.log('Queue items:', queueItems);

            // const queueLength = await redis.lLen('queue:email');
            // console.log('Queue length:', queueLength);
            res.status(200).json({
                status: "success",
                message: "Email added to queue"
            })
        } else {
            db.rollback()
            res.status(200).json({
                status: "failed",
                message: "Email not added to queue"
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

exports.getEmailStatus  = async function (req,res) {
    try {
        const getEmailStatus = await User.getEmailStatus(req.body)
        if(getEmailStatus){
            res.status(200).json({
                status : "success",
                message : "Email Status Update",
                result : {
                    data : getEmailStatus
                }
            })
        }else { 
            res.status(200).json({
                status : "success",
                message : "Email Status Update",
                result : {
                    data : getEmailStatus
                }
            })

        }
        
    } catch (e) {
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


