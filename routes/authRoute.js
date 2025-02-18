const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController")
const loginLimiter = require('../middleware/loginLimiter')

router.route('/register').post(controller.register)
router.route('/login').post(loginLimiter, controller.login)
router.route('/refresh').get(controller.refresh)
router.route('/logout').get(controller.logout)
router.route('/logout-everywhere').get(controller.logoutEverywhere)
router.route('/reset').post(controller.requestReset)
router.route('/update').put(controller.updatePassword)


module.exports = router;