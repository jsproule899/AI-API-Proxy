const express = require("express");
const router = express.Router();
const sttController = require('../controllers/sttController');

router.route('/openai').post(sttController.OpenAITranscription)

module.exports = router; 