const express = require("express");
const router = express.Router();
const ttsController = require('../controllers/ttsController');

router.route('/unrealspeech').post(ttsController.unrealSpeech);
router.route('/elevenlabs').post(ttsController.elevenLabs);
router.route('/openai').post(ttsController.openAI);

module.exports = router; 