require('dotenv').config();
const needle = require('needle');
const OpenAI = require('openai');
const fs = require('fs');
const url = require('url');


//create the route
const OpenAITranscription = async (req, res) => {


    const openai = new OpenAI();    
  
    const transcription = await openai.audio.transcriptions.create({
        file: new File([req.body], "transcribe.wav"),
        model: "whisper-1",
        language: "en"
    }).catch(async (err) => {
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

    if (transcription) {
        res.set('Content-Type', 'application/json')
        res.send(transcription)
    } else {
        res.set('Content-Type', 'plain/text')
        res.status(500).send("Error");
    }

}


const HuggingFaceTranscription = async (req, res) => {

      
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query //Query parameters passed to the proxy e.g city here
        })

        const data = req.body;
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('post', `${process.env.HF_WHISPER_URL}?${params}`, data, options);
        
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

module.exports = {
    OpenAITranscription,
    HuggingFaceTranscription
}