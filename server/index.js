const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Handle incoming POST requests
app.use(express.json());

app.post('/api/chat', (req, res) => {
  const apiKey = 'YOUR_API_KEY_HERE';
  const prompt = req.body.inputText;

  const client = axios.create({
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const params = {
    prompt: prompt,
    model: 'text-davinci-003',
    max_tokens: 10,
    temperature: 0,
  };

  client.post('https://api.openai.com/v1/completions', params)
    .then((result) => {
      // Send the response back to the client
      res.send(result.data.choices[0].text);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error processing request');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

