const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./config/db')

const app = express()



app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(' ') || ''
}));

//Http logger
app.use(morgan('tiny'));

//built-in middleware for json
app.use(express.json());

//built-in middleware to handle urelencoded form data
app.use(express.urlencoded({ extended: true }));

app.use(
    express.raw({
      inflate: true,
      limit: '500mb',
      type: () => true, // this matches all content types
    })
  );

app.use(express.static("Build"));

app.use('/api/stt', require('./routes/sttRoute'))
app.use('/api/aichat', require('./routes/aiChatRoute'))
app.use('/api/tts', require('./routes/ttsRoute'))
app.use('/api/scenario', require('./routes/scenarioRoute'))


app.all("*", (request, response, next) => {
    return response.status(404).json({ message: "Endpoint not found!" });
  });


module.exports = app;