const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
var corsOptions = {
  origin: ["http://localhost:3030","https://ai-api-proxy-3xie.onrender.com"]
}
app.use(cors(corsOptions));

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

app.get('/:id', (req, res) =>{
  res.sendFile("index.html")
}
)


app.all("*", (request, response, next) => {
    return response.status(404).json({ message: "Endpoint not found!" });
  });


module.exports = app;