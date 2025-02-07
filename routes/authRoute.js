const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController")

router.route('/register').post(controller.register)
router.route('/login').post(controller.login)
router.route('/refresh').get(controller.refresh)
router.route('/logout').get(controller.logout)


module.exports = router;