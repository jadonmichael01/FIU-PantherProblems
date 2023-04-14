let firstMessage = true;

function sendMessage() {
  var inputText = document.getElementById("userinput").value;
    
  if (!inputText.trim()) {
    return;
  }
    
  var chatBubble = document.createElement("span");
  chatBubble.classList.add("chat-bubble");
  chatBubble.innerHTML = inputText;

  var chatBox = document.getElementById("chatbox_grid_container");
  chatBox.appendChild(chatBubble);

  var animationBubble = document.createElement("span");
  var animation = document.createElement("img");
  animation.setAttribute('src', '/openai-axios/images/roary_run.gif')
  animation.setAttribute('alt', 'loading')
  animationBubble.appendChild(animation);
  chatBox.appendChild(animationBubble);

  generateAiResponse(inputText);
  document.getElementById("userinput").value = "";
}

function generateAiResponse(inputText) {

  const regex = /fiu|florida international university|2fa|two factor authentication|hello|canvas|registration|password|username|account|parking|it|vpn|duo|personal information|login|network|wifi|email/gi;

  // Check if the input text contains any FIU IT related keywords or phrases
  const containsFiuItKeyword = regex.test(inputText);

  // If the input text doesn't contain any FIU IT related keywords or phrases, respond with a message indicating that the AI only works for FIU IT
  if (!containsFiuItKeyword) {
    const sorryMessage = "Sorry, I only work for FIU IT.";
    var aiChatBubble = document.createElement("span");
    aiChatBubble.classList.add("ai-chat-bubble");
    aiChatBubble.innerHTML = sorryMessage;
    var chatBox = document.getElementById("chatbox_grid_container");
    chatBox.removeChild(chatBox.lastChild); // remove the animation element
    chatBox.appendChild(aiChatBubble);
    return;
  }

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
    max_tokens: Math.floor(Math.random() * (600 - 400 + 1) + 400),
    temperature: 0.7,
  };
  
  if (firstMessage) {
    firstMessage = false;
  } else {
    params.messages.shift();
  }
  
  client
    .post("https://api.openai.com/v1/chat/completions", params)
    .then((result) => {
      var aiChatBubble = document.createElement("span");
      aiChatBubble.classList.add("ai-chat-bubble");
      aiChatBubble.innerHTML = result.data.choices[0].message.content;
      var chatBox = document.getElementById("chatbox_grid_container");
      chatBox.removeChild(chatBox.lastChild); // remove the animation element
      chatBox.appendChild(aiChatBubble);
    })
    .catch((err) => {
      console.log("Error:", err.response ? err.response.data : err.message);
    });
}

		function toggleSidebar() {
			document.getElementById("sidebar").classList.toggle("active");

      var sidebar = document.querySelector('.sidebar');
	var content = document.querySelector('.content');
	if (sidebar.classList.contains('sidebar-open')) {
		sidebar.classList.remove('sidebar-open');
		content.classList.remove('sidebar-closed');
	} else {
		sidebar.classList.add('sidebar-open');
		content.classList.add('sidebar-closed');
	}
      
		}

