require('dotenv').config();
const needle = require('needle');
const OpenAI = require('openai');
const fs = require('fs');
const url = require('url');
const Anthropic = require('@anthropic-ai/sdk');

const openai = new OpenAI();
const anthropic = new Anthropic();
const deepseek = new OpenAI({
    baseURL: process.env.DEEPSEEK_URL,
    apiKey: process.env.DEEPSEEK_API_KEY
});


const OpenAIChat = (req, res) => {
    openai.chat.completions.create(req.body)
        .then((chatCompletion) => {
            const response = { message: chatCompletion.choices[0].message.content }
            res.set('Content-Type', 'application/json')
            res.json(response);
        })
        .catch((err) => {
            if (err instanceof OpenAI.APIError) {
                console.log(err.status);
                console.log(err.name);
                console.log(err.headers);
                console.log(err.message);
                return res.json(err);
            } else {
                res.set('Content-Type', 'plain/text')
                res.status(500).send("Error: " + err);
            }
        });
}

const OpenAIModels = async (req, res) => {
    try {
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('get', `${process.env.OPENAI_URL}/models`, options);


        if (apiResponse.statusCode == 200) {
            res.set('Content-Type', 'application/json')
            res.send(apiResponse.body.data)
        } else {
            res.set('Content-Type', 'plain/text')
            res.status(apiResponse.statusCode).send(apiResponse.body);
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
}

const openAIRealtimeSession = async (req, res) => {
    try {
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };

        const apiResponse = await needle('post', `${process.env.OPENAI_SESSION_URL}`, req.body, options);

        if (apiResponse.statusCode == 200) {
            res.set('Content-Type', 'application/json')
            res.send(apiResponse.body)
        } else {
            res.set('Content-Type', 'plain/text')
            res.status(apiResponse.statusCode).send(apiResponse.body);
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }
}


const AnthropicChat = (req, res) => {
    const { messages, model } = req.body;
    const system = messages.shift().content;


    anthropic.messages.create({
        max_tokens: 1024,
        system: system,
        messages: messages,
        model: model,
    })
        .then((message) => {
            if (message?.type === "message") {
                const response = { message: message.content[0].text.substring(message.content[0].text.lastIndexOf('*') + 1) }

                res.set('Content-Type', 'application/json')
                res.status(200).json(response);
            } else if (message?.type === "error") {
                res.json(message.error)
            }
        })
        .catch(async (err) => {
            if (err instanceof Anthropic.APIError) {
                console.log(err.status); // 400
                console.log(err.name); // BadRequestError
                console.log(err.headers); // {server: 'nginx', ...}
                console.log(err.message);
                return res.json(err);
            } else {
                res.set('Content-Type', 'plain/text')
                res.status(500).send("Error: " + err);
            }
        });
}

const DeepSeekChat = (req, res) => {
    deepseek.chat.completions.create(req.body)
        .then((chatCompletion) => {
            const response = { message: chatCompletion.choices[0].message.content }
            res.set('Content-Type', 'application/json')
            res.json(response);
        })
        .catch((err) => {
            if (err instanceof OpenAI.APIError) {
                console.log(err.status);
                console.log(err.name);
                console.log(err.headers);
                console.log(err.message);
                return res.json(err);
            } else {
                res.set('Content-Type', 'plain/text')
                res.status(500).send("Error: " + err);
            }
        });
}

module.exports = {
    OpenAIChat,
    OpenAIModels,
    openAIRealtimeSession,
    AnthropicChat,
    DeepSeekChat
}