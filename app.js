const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./config/db');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(' ') || '',
  credentials: true
}));

//Http logger
app.use(morgan('tiny'));

//built-in middleware for json
app.use(express.json());

//built-in middleware to handle urelencoded form data
app.use(express.urlencoded({ extended: true }));

//middleware for cookies
app.use(cookieParser());

app.use(
    express.raw({
      inflate: true,
      limit: '500mb',
      type: () => true, // this matches all content types
    })
  );


app.use('/api/auth', require('./routes/authRoute'))

//unity routes
app.use('/api/stt', require('./routes/sttRoute'))
app.use('/api/aichat', require('./routes/aiChatRoute'))
app.use('/api/tts', require('./routes/ttsRoute'))
app.use('/api/scenario', require('./routes/scenarioRoute'))

app.use(verifyJWT)
app.use('/api/issue', require('./routes/issueRoute'))
app.use('/api/transcript', require('./routes/transcriptRoute'))
app.use('/api/user', require('./routes/userRoute'))
app.use('/api/voice', require('./routes/voiceRoute'))


app.all("*", (request, response, next) => {
    return response.status(404).json({ message: "Endpoint not found!" });
  });


module.exports = app;