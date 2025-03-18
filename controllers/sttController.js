require('dotenv').config();
const needle = require('needle');
const OpenAI = require('openai');
const fs = require('fs');
const url = require('url');


//create the route
const OpenAITranscription = (req, res) => {
    const openai = new OpenAI();
    openai.audio.transcriptions.create({
        file: new File([req.body], "transcribe.wav"),
        model: "whisper-1",
        language: "en"
    }).then(transcription => {
        res.set('Content-Type', 'application/json')
        res.send(transcription)
    }).catch((err) => {
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


const HuggingFaceTranscription = async (req, res) => {
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query //Query parameters passed to the proxy
        })

        const data = req.body;
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };

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