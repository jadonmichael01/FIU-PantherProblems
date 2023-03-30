const express = require('express');
const axios = require('axios');

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} received.`);

  if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url.match(/\.css$/)) {
    const cssPath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(cssPath, 'UTF-8');
    
    res.writeHead(200, { 'Content-Type': 'text/css' });
    fileStream.pipe(res);
  } else if (req.url.match(/\.js$/)) {
    const jsPath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(jsPath, 'UTF-8');

    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    fileStream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 File Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const app = express();
const apiKey = process.env.OPENAI_API_KEY;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const inputText = req.body.inputText;
  
  const params = {
    prompt: inputText,
    model: 'text-davinci-003',
    max_tokens: 10,
    temperature: 0,
  };
  
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', params, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    
    res.json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



function sendMessage() {
  // Get the input value
  var inputText = document.getElementById("userinput").value;

  // Create a new chat bubble element
  var chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble");
  chatBubble.innerHTML = inputText;

  // Add the chat bubble to the chat box
  var chatBox = document.getElementById("USER");
  chatBox.appendChild(chatBubble);

  // Generate AI response
  generateAiResponse(inputText);

  // Clear the input field
  document.getElementById("userinput").value = "";

}

function generateAiResponse(inputText) {
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputText }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Create a new AI chat bubble element
      const aiChatBubble = document.createElement('div');
      aiChatBubble.classList.add('chat-bubble', 'ai');
      aiChatBubble.innerHTML = data.text;

      // Add the AI chat bubble to the chat box
      const chatBox = document.getElementById('USER');
      chatBox.appendChild(aiChatBubble);
    })
    .catch((error) => {
      console.error(error);
    });
}
