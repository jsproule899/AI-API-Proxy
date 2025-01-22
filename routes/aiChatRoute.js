const express = require("express");
const router = express.Router();
const aiChatController = require('../controllers/aiChatController');

router.route('/openai').post(aiChatController.OpenAIChat)
router.route('/openai/models').get(aiChatController.OpenAIModels)
router.route('/anthropic').post(aiChatController.AnthropicChat)
router.route('/deepseek').post(aiChatController.DeepSeekChat)

module.exports = router; 