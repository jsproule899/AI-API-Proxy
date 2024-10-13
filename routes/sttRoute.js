const express = require("express");
const router = express.Router();
const sttController = require('../controllers/sttController');

router.route('/openai').post(sttController.OpenAITranscription)
router.route('/huggingface').post(sttController.HuggingFaceTranscription)

module.exports = router; 