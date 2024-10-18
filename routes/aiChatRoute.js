const express = require("express");
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');

router.route('/openai').post(aiChatController.OpenAIChat)
router.route('/anthropic').post(aiChatController.AnthropicChat)

module.exports = router; 