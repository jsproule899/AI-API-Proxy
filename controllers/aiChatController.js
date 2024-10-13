require('dotenv').config();
const needle = require('needle');
const OpenAI = require('openai');
const fs = require('fs');
const url = require('url');


//create the route
const OpenAIChat = async (req, res) => {


    const openai = new OpenAI();    
  
    const chatCompletion = await openai.chat.completions.create(req.body)   
    .catch(async (err) => {
        if (err instanceof OpenAI.APIError) {
            console.log(err.status); // 400
            console.log(err.name); // BadRequestError
            console.log(err.headers); // {server: 'nginx', ...}
            console.log(err.message);
        } else {
            throw err;
        }
    });

    if (chatCompletion) {
        res.set('Content-Type', 'application/json')
        res.send(chatCompletion)
    } else {
        res.set('Content-Type', 'plain/text')
        res.status(500).send("Error");
    }

}

module.exports = {
    OpenAIChat
}