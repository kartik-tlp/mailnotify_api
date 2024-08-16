const express = require('express');
const userController = require("../controllers/userController")
const router = express.Router();

router.post("/composeMail" , userController.addUserMailData)

router.post("/sendMail" , userController.sendMail)

router.post("/getEmailStatus" , userController.getEmailStatus )





module.exports = router;