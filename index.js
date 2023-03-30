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
  // Make API call to OpenAI
  const axios = require("axios");
  const apiKey = process.env.OPENAI_API_KEY;

  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    prompt: inputText,
    model: "text-davinci-003",
    max_tokens: 10,
    temperature: 0,
  };

  client
    .post("https://api.openai.com/v1/completions", params)
    .then((result) => {
      // Create a new AI chat bubble element
      var aiChatBubble = document.createElement("div");
      aiChatBubble.classList.add("chat-bubble", "ai");
      aiChatBubble.innerHTML = result.data.choices[0].text;

      // Add the AI chat bubble to the chat box
      var chatBox = document.getElementById("USER");
      chatBox.appendChild(aiChatBubble);
    })
    .catch((err) => {
      console.log(err);
    });
}
