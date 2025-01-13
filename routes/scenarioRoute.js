const express = require("express");
const router = express.Router();
const controller = require('../controllers/scenarioController')

router.route('/').get(controller.find)
router.route('/:id').get(controller.findById)
router.route('/').post(controller.create)
router.route('/:id').put(controller.update)
router.route('/:id').delete(controller.remove)


module.exports = router;