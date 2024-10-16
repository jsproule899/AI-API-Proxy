const express = require("express");
const router = express.Router();
const ttsController = require('../controllers/ttsController');

router.route('/unrealspeech/stream').post(ttsController.streamUnrealSpeech);
router.route('/unrealspeech/speech').post(ttsController.speechUnrealSpeech);

router.route('/elevenlabs').post(ttsController.elevenLabs);

module.exports = router; 