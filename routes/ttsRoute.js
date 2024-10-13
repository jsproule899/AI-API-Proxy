const express = require("express");
const router = express.Router();
const ttsController = require('../controllers/ttsController');

router.route('/unrealspeech').post(ttsController.streamUnrealSpeech)

module.exports = router; 