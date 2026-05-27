// ========================================
// CHAT PAGE - Handles group chat functionality
// ========================================

// Get the group name from the URL (e.g., ?group=Math511)
const urlParams = new URLSearchParams(window.location.search);
const groupName = urlParams.get("group") || "General";

// Get all the HTML elements we need
const groupTitle = document.getElementById("group-name");
const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-message");
const typingIndicator = document.getElementById("typing");
const emojiButton = document.getElementById("emoji-btn");
const imageUploadInput = document.getElementById("image-upload");
const createGroupButton = document.getElementById("createGroup");
const newGroupNameInput = document.getElementById("newGroup");

// Set the page title to show which group we're in
groupTitle.textContent = groupName + " Group Chat";

// ========================================
// 1. WHO IS THE CURRENT USER?
// ========================================
let currentUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
let welcomeMessageSent = false;

// ========================================
// 2. LOAD EXISTING MESSAGES FROM STORAGE
// ========================================
let allMessages = JSON.parse(localStorage.getItem(groupName)) || [];

// Check if we already sent a welcome message to this user
const welcomeKey =
  groupName + "_welcome_sent_" + (currentUser?.email || "anonymous");
welcomeMessageSent = localStorage.getItem(welcomeKey) === "true";

// ========================================
// 3. GIF LIBRARY - 10 Fun GIFs to choose from
// ========================================
const gifCollection = [
  {
    name: "👋 Wave",
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGNyNHViYWx3Z3h3YjhmMzlodWJ3bnoxNW5yODlwZTc5NnJxcDY4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgG50Fb7Mi0prBC/giphy.gif",
    emoji: "👋",
  },
  {
    name: "😂 Laugh",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTk4c2lmYmV6YTRvYmZ4b2dneWVmZ2g2cWJlcWJuN2I1dHF6cHV4NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wWue0rCDOphOE/giphy.gif",
    emoji: "😂",
  },
  {
    name: "👍 Thumbs Up",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjdnbDE5M3Q5b3lyZzJwYXhqdmdjeXM2b3IyMW9yMDdpdHoxZm5yOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tIeCLkB8geYtW/giphy.gif",
    emoji: "👍",
  },
  {
    name: "🎉 Celebration",
    url: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MHV4bDhrd2ViYXNubHZvd2Y1NngyZWJpdzRia3M5aTdrcDF2NDkzdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FY5vhK1zpoJGqap917/giphy.gif",
    emoji: "🎉",
  },
  {
    name: "❤️ Love",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnhlcGg5cHE2cXBueDZhbTY3YmQ4OGdxcDNhdTRiandrYTZ2OHZpcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SYo1DFS8NLhhqzzjMU/giphy.gif",
    emoji: "❤️",
  },
  {
    name: "😮 Wow",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzFibDZqdXBjd3ozd291MG51dmllcDJib2FoaTdmdXcxMHhhb2VueiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5VKbvrjxpVJCM/giphy.gif",
    emoji: "😮",
  },
  {
    name: "🙏 Please",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjh4eHllc2Y0ODI4YXNnMTlwYmIweXRmeDcxZ3Bwbzhtd3cyODhoZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zZbf6UpZslp3nvFjIR/giphy.gif",
    emoji: "🙏",
  },
  {
    name: "🔥 Fire",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGg5dzhtNnQwb2x3ZmFleHQzOGZ3MGptNnF3Nm1zYWxkaHhxb25xeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/AHeTfHgVFPHgs/giphy.gif",
    emoji: "🔥",
  },
  {
    name: "💯 100",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTg5cWNuN3MycnhzcTFvZGxwNHBxZWxsc3Fwam9pZmxxbWFkeXczaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9Fqek5SdRxZ0W1jZK9/giphy.gif",
    emoji: "💯",
  },
  {
    name: "✨ Stars",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzgzbmdmaDRtazlud2QzYXcwOHFkaWR2dXJhdXA3b2ZwOGo1bDh4YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ePckuPKIpKEmd8p7DE/giphy.gif",
    emoji: "✨",
  },
];

// ========================================
// 4. CREATE THE GIF BUTTON AND PICKER
// ========================================

// Make the GIF button
const gifButton = document.createElement("button");
gifButton.innerHTML = "🎥 GIF";
gifButton.id = "gif-btn";
gifButton.type = "button";

// Make the GIF picker (popup window)
const gifPicker = document.createElement("div");
gifPicker.id = "gif-picker";
gifPicker.className = "gif-picker";
gifPicker.style.display = "none";
gifPicker.innerHTML = `
  <div class="gif-picker-header">
    <h4>Choose a GIF</h4>
    <button id="close-gif-picker">✖</button>
  </div>
  <div class="gif-grid" id="gif-grid"></div>
`;

// Add the GIF button to the chat input area
const chatInputArea = document.querySelector(".chat_input");
if (chatInputArea) {
  const existingEmojiButton = document.getElementById("emoji-btn");
  if (existingEmojiButton) {
    chatInputArea.insertBefore(gifButton, existingEmojiButton);
  } else {
    chatInputArea.appendChild(gifButton);
  }
  chatInputArea.appendChild(gifPicker);
}

// Show all GIFs in the picker
function showAllGifs() {
  const gifGrid = document.getElementById("gif-grid");
  if (!gifGrid) return;

  gifGrid.innerHTML = "";

  for (let i = 0; i < gifCollection.length; i++) {
    let gif = gifCollection[i];
    let gifItem = document.createElement("div");
    gifItem.className = "gif-item";
    gifItem.innerHTML = `
      <div class="gif-emoji">${gif.emoji}</div>
      <div class="gif-name">${gif.name}</div>
    `;

    gifItem.addEventListener("click", function () {
      sendGifMessage(gif.url, gif.name);
      gifPicker.style.display = "none";
    });

    gifGrid.appendChild(gifItem);
  }
}

// Send a GIF message
function sendGifMessage(gifUrl, gifName) {
  let newMessage = {
    text: gifUrl,
    type: "sent",
    sender: currentUser?.username || currentUser?.name || "You",
    time: getCurrentTime(),
    isImage: true,
    isGif: true,
    gifName: gifName,
  };

  allMessages.push(newMessage);
  saveMessages();
  displayAllMessages();

  setTimeout(function () {
    let botReply = {
      text: "Nice GIF! 🎥 " + gifName,
      type: "received",
      sender: "Bot 🤖",
      time: getCurrentTime(),
      isImage: false,
    };
    allMessages.push(botReply);
    saveMessages();
    displayAllMessages();
  }, 500);
}

// Show/hide GIF picker when button is clicked
if (gifButton) {
  gifButton.addEventListener("click", function (event) {
    event.stopPropagation();
    let isVisible = gifPicker.style.display === "flex";
    gifPicker.style.display = isVisible ? "none" : "flex";
    showAllGifs();
  });
}

// Close GIF picker when clicking outside
document.addEventListener("click", function (event) {
  if (
    gifPicker &&
    !gifPicker.contains(event.target) &&
    event.target !== gifButton
  ) {
    gifPicker.style.display = "none";
  }
});

// Close button for GIF picker
document.addEventListener("click", function (event) {
  if (event.target.id === "close-gif-picker") {
    gifPicker.style.display = "none";
  }
});

// ========================================
// 5. DISPLAY ALL MESSAGES ON SCREEN
// ========================================
function displayAllMessages() {
  if (!messagesContainer) return;

  messagesContainer.innerHTML = "";

  for (let i = 0; i < allMessages.length; i++) {
    let message = allMessages[i];
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", message.type);
    messageDiv.classList.add("fade-in");

    let messageContent = "";
    if (message.isImage && message.isGif) {
      messageContent = `<img src="${message.text}" alt="gif" style="max-width: 250px; border-radius: 12px; cursor: pointer;" onclick="window.open(this.src)"><div class="gif-label">🎥 GIF: ${message.gifName || "GIF"}</div>`;
    } else if (message.isImage) {
      messageContent = `<img src="${message.text}" style="max-width: 250px; border-radius: 12px; cursor: pointer;" onclick="window.open(this.src)">`;
    } else {
      messageContent = message.text;
    }

    let senderName =
      message.sender || (message.type === "sent" ? "You" : "Bot");
    messageDiv.innerHTML = `
      <div class="message-bubble">
        <strong class="message-sender">${senderName}</strong>
        <p>${messageContent}</p>
        <small class="timestamp">${message.time || ""}</small>
      </div>
      ${message.type === "sent" ? '<button class="delete-msg" data-index="' + i + '">🗑️</button>' : ""}
    `;

    messagesContainer.appendChild(messageDiv);
  }

  let deleteButtons = document.querySelectorAll(".delete-msg");
  for (let i = 0; i < deleteButtons.length; i++) {
    let button = deleteButtons[i];
    button.addEventListener("click", function () {
      let index = parseInt(button.getAttribute("data-index"));
      if (!isNaN(index)) {
        allMessages.splice(index, 1);
        saveMessages();
        displayAllMessages();
      }
    });
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getCurrentTime() {
  let now = new Date();
  return now.toLocaleTimeString();
}

function saveMessages() {
  localStorage.setItem(groupName, JSON.stringify(allMessages));
}

// ========================================
// 6. SEND A NEW MESSAGE
// ========================================
if (chatForm) {
  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let messageText = chatInput.value.trim();
    if (!messageText) return;

    let newMessage = {
      text: messageText,
      type: "sent",
      sender: currentUser?.username || currentUser?.name || "You",
      time: getCurrentTime(),
      isImage: false,
      isGif: false,
    };

    allMessages.push(newMessage);
    saveMessages();
    displayAllMessages();

    chatInput.value = "";

    if (!welcomeMessageSent && currentUser) {
      welcomeMessageSent = true;
      localStorage.setItem(welcomeKey, "true");

      let userName = currentUser.name || currentUser.username || "there";
      let welcomeMessages = [
        "👋 Welcome to the " +
          groupName +
          " group, " +
          userName +
          "! We're glad to have you here!",
        "🎉 Hey " +
          userName +
          "! Welcome to " +
          groupName +
          "! Feel free to share your thoughts.",
        "💬 " + userName + " joined the chat! Welcome to " + groupName + "!",
        "✨ Welcome " +
          userName +
          "! This is the " +
          groupName +
          " group chat. Enjoy your stay!",
        "🚀 " +
          userName +
          " has arrived! Welcome to the " +
          groupName +
          " community!",
        "🌟 A warm welcome to " +
          userName +
          " in " +
          groupName +
          "! Let's have great discussions!",
      ];

      let randomIndex = Math.floor(Math.random() * welcomeMessages.length);
      let randomWelcome = welcomeMessages[randomIndex];

      setTimeout(function () {
        let welcomeMsg = {
          text: randomWelcome,
          type: "received",
          sender: "Bot 🤖",
          time: getCurrentTime(),
          isImage: false,
        };
        allMessages.push(welcomeMsg);
        saveMessages();
        displayAllMessages();

        setTimeout(function () {
          let helpMsg = {
            text: "💡 Tip: You can send images 📸, GIFs 🎥, use emojis 😀, and delete your own messages!",
            type: "received",
            sender: "Bot 🤖",
            time: getCurrentTime(),
            isImage: false,
          };
          allMessages.push(helpMsg);
          saveMessages();
          displayAllMessages();
        }, 1500);
      }, 800);
    } else if (welcomeMessageSent) {
      let lowerText = messageText.toLowerCase();

      setTimeout(function () {
        let botResponse = null;

        if (
          lowerText.includes("hello") ||
          lowerText.includes("hi") ||
          lowerText.includes("hey")
        ) {
          botResponse =
            "Hello " +
            (currentUser?.name || "there") +
            "! How can I help you today? 👋";
        } else if (
          lowerText.includes("thanks") ||
          lowerText.includes("thank you")
        ) {
          botResponse = "You're welcome! 😊 Happy to help!";
        } else if (lowerText.includes("bye") || lowerText.includes("goodbye")) {
          botResponse = "Goodbye! Come back soon! 👋";
        } else if (lowerText.includes("help")) {
          botResponse =
            "I can help you with:\n• Sending messages\n• Sharing images 📸\n• Sending GIFs 🎥\n• Using emojis 😀\n• Deleting your messages (click 🗑️)";
        } else if (lowerText.includes("gif")) {
          botResponse = "Try clicking the 🎥 GIF button to send a fun GIF!";
        }

        if (botResponse) {
          let replyMsg = {
            text: botResponse,
            type: "received",
            sender: "Bot 🤖",
            time: getCurrentTime(),
            isImage: false,
          };
          allMessages.push(replyMsg);
          saveMessages();
          displayAllMessages();
        }
      }, 500);
    }
  });
}

// ========================================
// 8. EMOJI BUTTON
// ========================================
if (emojiButton) {
  emojiButton.addEventListener("click", function () {
    chatInput.value += "😀";
    chatInput.focus();
  });
}

// ========================================
// 9. IMAGE UPLOAD
// ========================================
if (imageUploadInput) {
  imageUploadInput.addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB!");
      imageUploadInput.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      imageUploadInput.value = "";
      return;
    }

    let fileReader = new FileReader();

    fileReader.onload = function () {
      let newMessage = {
        text: fileReader.result,
        type: "sent",
        sender: currentUser?.username || currentUser?.name || "You",
        time: getCurrentTime(),
        isImage: true,
        isGif: false,
      };

      allMessages.push(newMessage);
      saveMessages();
      displayAllMessages();

      setTimeout(function () {
        let ackMsg = {
          text: "Nice image! 📸 Thanks for sharing!",
          type: "received",
          sender: "Bot 🤖",
          time: getCurrentTime(),
          isImage: false,
        };
        allMessages.push(ackMsg);
        saveMessages();
        displayAllMessages();
      }, 500);
    };

    fileReader.readAsDataURL(file);
    imageUploadInput.value = "";
  });
}

// ===================================
// SEARCH GROUPS
// ===================================

$(".group_search button").on("click", function () {
  const search = $(".group_search input").val().toLowerCase();

  $(".groups .group").each(function () {
    const groupName = $(this).find("h4 a").text().toLowerCase();

    if (groupName.includes(search)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});

// ========================================
// 15. ADD CSS STYLES FOR THE CHAT
// ========================================
function addChatStyles() {
  if (!document.querySelector("#chatStyles")) {
    let styleElement = document.createElement("style");
    styleElement.id = "chatStyles";
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in { animation: fadeIn 0.3s ease; }
      .message { margin-bottom: 15px; display: flex; align-items: flex-start; gap: 10px; }
      .message.sent { justify-content: flex-end; }
      .message-bubble { max-width: 70%; padding: 10px 15px; border-radius: 18px; }
      .message.sent .message-bubble { background: linear-gradient(135deg, #0052cc, #1e90ff); color: white; border-bottom-right-radius: 5px; }
      .message.received .message-bubble { background: #1e293b; color: #f1f5f9; border-bottom-left-radius: 5px; }
      .message-sender { font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px; opacity: 0.8; }
      .timestamp { font-size: 10px; opacity: 0.6; display: block; margin-top: 5px; }
      .delete-msg { background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; padding: 5px; }
      .delete-msg:hover { opacity: 1; }
      .join-group-btn { margin-top: 10px; padding: 8px 16px; background: linear-gradient(135deg, #0052cc, #1e90ff); border: none; border-radius: 20px; color: white; cursor: pointer; font-size: 12px; }
      .join-group-btn:hover { transform: translateY(-2px); }
      #gif-btn { background: #30363d; border: none; color: white; padding: 12px 18px; border-radius: 14px; cursor: pointer; transition: 0.3s; font-size: 1rem; }
      #gif-btn:hover { background: #1e90ff; transform: scale(1.05); }
      .gif-picker { position: absolute; bottom: 80px; right: 20px; background: #161b22; border: 1px solid #1e90ff; border-radius: 16px; width: 300px; max-height: 400px; overflow-y: auto; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; }
      .gif-picker-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #30363d; background: #1e293b; }
      .gif-picker-header h4 { color: #58a6ff; margin: 0; }
      #close-gif-picker { background: none; border: none; color: white; font-size: 18px; cursor: pointer; }
      #close-gif-picker:hover { color: #ff4757; }
      .gif-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 15px; }
      .gif-item { background: #21262d; border-radius: 12px; padding: 12px; text-align: center; cursor: pointer; transition: 0.3s; }
      .gif-item:hover { transform: translateY(-3px); border: 1px solid #1e90ff; }
      .gif-emoji { font-size: 40px; margin-bottom: 5px; }
      .gif-name { font-size: 12px; color: #c9d1d9; }
      .chat_input { position: relative; }
    `;
    document.head.appendChild(styleElement);
  }
}

// ========================================
// 16. START EVERYTHING
// ========================================
addChatStyles();
displayAllMessages();
setupJoinGroupButtons();

// Fake online users count
let onlineUsersElement = document.querySelector(".online-users");
if (onlineUsersElement) {
  setInterval(function () {
    let randomCount = Math.floor(Math.random() * 20) + 1;
    onlineUsersElement.innerHTML =
      '<span class="online-dot"></span> ' + randomCount + " users online";
  }, 30000);
}

console.log("✅ Chat loaded for group: " + groupName);
