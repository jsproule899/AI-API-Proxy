require('dotenv').config();
const needle = require('needle');
const url = require('url');


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
            ...url.parse(req.url, true).query //Query parameters passed to the proxy e.g city here
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

module.exports = {
    unrealSpeech,
    elevenLabs
}