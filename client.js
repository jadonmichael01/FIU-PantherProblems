let firstMessage = true;

function sendMessage() {
  // Get the input value
  var inputText = document.getElementById("userinput").value;

  // Check if the input contains non-whitespace characters
  if (!inputText.trim()) {
    // If the input is empty or contains only whitespace, return without sending the message
    return;
  }

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
  const apiKey = "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";

  const client = axios.create({
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that is an expert in Florida International University. You know about all the Two factor authentication. You can provide answers to questions about FIUASKIT. If you are unable to provide an answer to a question, please respond with the phrase 'Sorry I only work for FIU'.",
      },
      {
        role: "user",
        content: inputText,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: Math.floor(Math.random() * (600 - 400 + 1) + 400), // Random token size between 400 and 600
    temperature: 0.7,
  };

  // Remove the system message after the first response
  if (firstMessage) {
    firstMessage = false;
  } else {
    params.messages.shift();
  }

  client
    .post("https://api.openai.com/v1/chat/completions", params) // Use the v1 chat API
    .then((result) => {
      // Log the result to the console
      console.log(result);

      // Create a new AI chat bubble element
      var aiChatBubble = document.createElement("div");
      aiChatBubble.classList.add("chat-bubble", "ai");
      aiChatBubble.innerHTML = result.data.choices[0].message.content; // No need to truncate, since the response will be limited by max_tokens

      // Add the AI chat bubble to the chat box
      var chatBox = document.getElementById("USER");
      chatBox.appendChild(aiChatBubble);
    })
    .catch((err) => {
      console.log("Error:", err.response ? err.response.data : err.message);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sendbutton").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    sendMessage();
  });
});
