require('dotenv').config();
const OpenAI = require('openai');
const needle = require('needle');
const url = require('url');

const openai = new OpenAI();

//create the route
const unrealSpeech = async (req, res) => {
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query
        })

        const data = req.body;
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.UNREAL_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('post', `${process.env.UNREALSPEECH_URL}/${data.mode}?${params}`, { ...data, Text: data.text, VoiceId: data.voice }, options);

        if (apiResponse.statusCode == 200) {
            res.set('Content-Type', 'audio/mpeg');
            res.send(apiResponse.body);
        } else {
            res.set('Content-Type', 'plain/text');
            res.status(apiResponse.statusCode).send(apiResponse.body);
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
}


const elevenLabs = async (req, res) => {
    const { text, voice } = req.body;

    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query //Query parameters passed to the proxy
        })

        const data = req.body;
        data.model_id = "eleven_turbo_v2";

        const options = {
            headers: {
                'xi-api-key': `${process.env.E11LABS_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('post', `${process.env.ELEVENLABS_URL}/${voice}?${params}`, data, options);

        if (apiResponse.statusCode == 200) {
            res.set('Content-Type', 'audio/mpeg');
            res.send(apiResponse.body);
        } else {
            res.set('Content-Type', 'plain/text');
            res.status(apiResponse.statusCode).send(apiResponse.body);
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
}

const openAI = async (req, res) => {

    const { text, voice } = req.body;

    openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: voice,
        input: text
    }).then((mp3) => {
        const buffer = Buffer.from(mp3.arrayBuffer());
        res.set('Content-Type', 'audio/mp3')
        res.send(buffer);
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

module.exports = {
    unrealSpeech,
    elevenLabs,
    openAI
}