const express = require("express");
const router = express.Router();
const controller = require('../controllers/scenarioController')
const verifyJWT = require('../middleware/verifyJWT');

router.route('/:id').get(controller.findById)
router.use(verifyJWT)
router.route('/').get(controller.find)
router.route('/').post(controller.create)
router.route('/:id').put(controller.update)
router.route('/:id').delete(controller.remove)


module.exports = router;