const express = require("express");
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');

router.route('/openai').post(aiChatController.OpenAIChat)

module.exports = router; 