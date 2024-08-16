
const db = require("../config/db")
const redis = require("../config/redisConnection")
const User = require("../models/userModel")
const {matchedData,validationResult} = require('express-validator');



exports.addUserMailData = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const x = matchedData(req);
        return res.send({ message: 'Invalid Values', status: 'invalid', err: errors.mapped() });
    }
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const x = matchedData(req);
        return res.send({ message: 'Invalid Values', status: 'invalid', err: errors.mapped() });
    }
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

// exports.resendMails = async function(req,res){
//     try {
//         const getUnsendMails = await User.getUnsendMails(req.body)

     


        
//     } catch (e) {
//         var err = {
//             code: e.code,
//             sqlMessage: e.sqlMessage
//         };
//         res.status(200).json({
//             message: "Error Occured",
//             status: "error",
//             err: err
//         });
//         return false;
        
//     }
// }

