require('dotenv').config();
const needle = require('needle');
const url = require('url');
import { ElevenLabsClient, ElevenLabs } from "elevenlabs";

//create the route
const streamUnrealSpeech = async (req, res) => {
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query //Query parameters passed to the proxy e.g city here
        })

        const data = req.body;
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.UNREAL_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('post', `${process.env.UNREALSPEECH_URL}/stream?${params}`, data, options);

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

const speechUnrealSpeech = async (req, res) => {
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query //Query parameters passed to the proxy e.g city here
        })

        const data = req.body;
        const options = {
            headers: {
                'Authorization': `Bearer ${process.env.UNREAL_API_KEY}`,
                'Content-Type': 'application/json'

            }
        };
        //Call the actual api here using needle
        const apiResponse = await needle('post', `${process.env.UNREALSPEECH_URL}/speech?${params}`, data, options);

        if (apiResponse.statusCode == 200) {
            res.set('Content-Type', 'application/json');
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
    

    const client = new ElevenLabsClient({ apiKey: process.env.E11LABS_API_KEY });
    const apiResponse = await client.textToSpeech.convert(voice, {
        optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
        output_format: ElevenLabs.OutputFormat.Mp344100128,
        text: text,
    });

    if (apiResponse.statusCode == 200) {
        res.set('Content-Type', 'audio/mpeg');
        res.send(apiResponse.body);
    } else {
        res.set('Content-Type', 'plain/text');
        res.status(apiResponse.statusCode).send(apiResponse.body);
    }
}

module.exports = {
    streamUnrealSpeech,
    speechUnrealSpeech,
    elevenLabs
}