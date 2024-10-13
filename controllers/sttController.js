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
        Language: "en"
    }).catch(async (err) => {
        if (err instanceof OpenAI.APIError) {
            console.log(err.status); // 400
            console.log(err.name); // BadRequestError
            console.log(err.headers); // {server: 'nginx', ...}
            console.log(err.message);
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

module.exports = {
    OpenAITranscription
}