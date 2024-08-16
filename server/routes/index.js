const express = require('express');
const userController = require("../controllers/userController")
const router = express.Router();
const { check, validationResult, matchedData, oneOf, body } = require('express-validator');

router.post("/composeMail",oneOf([
    [
        check('to', 'Receiver Mail is required').notEmpty().isEmail().withMessage('Invalid email format'),
        check('mailsubject', 'Subject is required').notEmpty(),
        check('content', 'Content is required').notEmpty(),
    ]
]),userController.addUserMailData)

router.post("/sendMail",oneOf([
    [
        check('emailId', 'Email Id is required').notEmpty()
    ]
]), userController.sendMail)

router.post("/getEmailStatus" , userController.getEmailStatus )





module.exports = router;