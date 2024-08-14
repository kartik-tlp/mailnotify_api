const express = require('express');
const userController = require("../controllers/userController")
const router = express.Router();

router.post("/sendmail" , userController.addUserMailData)

module.exports = router;