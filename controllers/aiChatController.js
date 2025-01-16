require('dotenv').config();
const needle = require('needle');
const OpenAI = require('openai');
const fs = require('fs');
const url = require('url');
const Anthropic = require('@anthropic-ai/sdk');

const openai = new OpenAI();
const anthropic = new Anthropic();


//create the route
const OpenAIChat = async (req, res) => {
    const chatCompletion = await openai.chat.completions.create(req.body)
        .catch(async (err) => {
            if (err instanceof OpenAI.APIError) {
                console.log(err.status); // 400
                console.log(err.name); // BadRequestError
                console.log(err.headers); // {server: 'nginx', ...}
                console.log(err.message);
               return res.json(err);
            } else {
                throw err;
            }
        });

    if (chatCompletion) {

        const response = { message: chatCompletion.choices[0].message.content }

        res.set('Content-Type', 'application/json')
        res.json(response);
    } else {
        res.set('Content-Type', 'plain/text')
        res.status(500).send("Error");
    }

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



const AnthropicChat = async (req, res) => {
    const { messages, model } = req.body;
    const system = messages.shift().content;


    const message = await anthropic.messages.create({
        max_tokens: 1024,
        system: system,
        messages: messages,
        model: model,
    }).catch(async (err) => {
        if (err instanceof Anthropic.APIError) {
            console.log(err.status); // 400
            console.log(err.name); // BadRequestError
            console.log(err.headers); // {server: 'nginx', ...}
            console.log(err.message);
            return res.json(err);
        } else {
            throw err;
        }
    });

    if (message?.type === "message") {
        const response = { message: message.content[0].text.substring(message.content[0].text.lastIndexOf('*') + 1) }

        res.set('Content-Type', 'application/json')
        res.status(200).json(response);
    } else if (message?.type === "error") {
        res.json(message.error)
    }
    else {
        res.set('Content-Type', 'plain/text')
        res.status(500).send("Error");
    }
}

module.exports = {
    OpenAIChat,
    OpenAIModels,
    AnthropicChat
}