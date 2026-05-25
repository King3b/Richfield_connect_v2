const params = new URLSearchParams(window.location.search);
const group = params.get("group") || "General";

// ELEMENTS
const groupName = document.getElementById("group-name");
const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-message");
const typing = document.getElementById("typing");
const emojiBtn = document.getElementById("emoji-btn");
const imageUpload = document.getElementById("image-upload");
const createGroup = document.getElementById("createGroup");
const newGroup = document.getElementById("newGroup");

// SET TITLE
groupName.textContent = `${group} Group Chat`;

// =========================
// GET CURRENT USER
// =========================
let currentUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
let hasSentWelcomeMessage = false;

// =========================
// LOAD MESSAGES FROM STORAGE
// =========================
let groupMessages = JSON.parse(localStorage.getItem(group)) || [];

// Check if welcome message was already sent for this user in this group
const welcomeKey = `${group}_welcome_sent_${currentUser?.email || "anonymous"}`;
hasSentWelcomeMessage = localStorage.getItem(welcomeKey) === "true";

// =========================
// GIF DATA - 10 BASIC GIFS
// =========================
const gifLibrary = [
  {
    name: "👋 Wave",
    url: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
    emoji: "👋",
  },
  {
    name: "😂 Laugh",
    url: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
    emoji: "😂",
  },
  {
    name: "👍 Thumbs Up",
    url: "https://media.giphy.com/media/3o6Zt6ML6Bklcaj9A/giphy.gif",
    emoji: "👍",
  },
  {
    name: "🎉 Celebration",
    url: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
    emoji: "🎉",
  },
  {
    name: "❤️ Love",
    url: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
    emoji: "❤️",
  },
  {
    name: "😮 Wow",
    url: "https://media.giphy.com/media/3o6Zt6ML6Bklcaj9A/giphy.gif",
    emoji: "😮",
  },
  {
    name: "🙏 Please",
    url: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
    emoji: "🙏",
  },
  {
    name: "🔥 Fire",
    url: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
    emoji: "🔥",
  },
  {
    name: "💯 100",
    url: "https://media.giphy.com/media/3o6Zt6ML6Bklcaj9A/giphy.gif",
    emoji: "💯",
  },
  {
    name: "✨ Stars",
    url: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
    emoji: "✨",
  },
];

// Create GIF button and picker
const gifBtn = document.createElement("button");
gifBtn.innerHTML = "🎥 GIF";
gifBtn.id = "gif-btn";
gifBtn.type = "button";

// Create GIF picker dropdown
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

// Add GIF button to chat input
const chatInputContainer = document.querySelector(".chat_input");
if (chatInputContainer) {
  // Insert GIF button before the emoji button or at the end
  const emojiButton = document.getElementById("emoji-btn");
  if (emojiButton) {
    chatInputContainer.insertBefore(gifBtn, emojiButton);
  } else {
    chatInputContainer.appendChild(gifBtn);
  }
  chatInputContainer.appendChild(gifPicker);
}

// Populate GIF grid
function populateGifGrid() {
  const gifGrid = document.getElementById("gif-grid");
  if (!gifGrid) return;

  gifGrid.innerHTML = "";
  gifLibrary.forEach((gif, index) => {
    const gifItem = document.createElement("div");
    gifItem.className = "gif-item";
    gifItem.innerHTML = `
      <div class="gif-emoji">${gif.emoji}</div>
      <div class="gif-name">${gif.name}</div>
    `;
    gifItem.addEventListener("click", () => {
      sendGifMessage(gif.url, gif.name);
      gifPicker.style.display = "none";
    });
    gifGrid.appendChild(gifItem);
  });
}

// Send GIF message
function sendGifMessage(gifUrl, gifName) {
  const newMsg = {
    text: gifUrl,
    type: "sent",
    sender: currentUser?.username || currentUser?.name || "You",
    time: new Date().toLocaleTimeString(),
    isImage: true,
    isGif: true,
    gifName: gifName,
  };

  groupMessages.push(newMsg);
  saveMessages();
  renderMessages();

  // Optional: Bot acknowledges GIF
  setTimeout(() => {
    const ackMsg = {
      text: `Nice GIF! 🎥 ${gifName}`,
      type: "received",
      sender: "Bot 🤖",
      time: new Date().toLocaleTimeString(),
      isImage: false,
    };
    groupMessages.push(ackMsg);
    saveMessages();
    renderMessages();
  }, 500);
}

// Toggle GIF picker
if (gifBtn) {
  gifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = gifPicker.style.display === "flex";
    gifPicker.style.display = isVisible ? "none" : "flex";
    populateGifGrid();
  });
}

// Close GIF picker when clicking outside
document.addEventListener("click", (e) => {
  if (gifPicker && !gifPicker.contains(e.target) && e.target !== gifBtn) {
    gifPicker.style.display = "none";
  }
});

// Close button for GIF picker
document.addEventListener("click", (e) => {
  if (e.target.id === "close-gif-picker") {
    gifPicker.style.display = "none";
  }
});

// =========================
// RENDER MESSAGES
// =========================
function renderMessages() {
  if (!messagesContainer) return;

  messagesContainer.innerHTML = "";

  groupMessages.forEach((msg, index) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", msg.type);

    // Add animation class
    messageDiv.classList.add("fade-in");

    // Handle different message types
    let messageContent = "";
    if (msg.isImage && msg.isGif) {
      // GIF message
      messageContent = `<img src="${msg.text}" alt="gif" class="gif-message" style="max-width: 250px; border-radius: 12px; cursor: pointer;" onclick="window.open(this.src)"><div class="gif-label">🎥 GIF: ${msg.gifName || "GIF"}</div>`;
    } else if (msg.isImage) {
      // Regular image message
      messageContent = `<img src="${msg.text}" style="max-width: 250px; border-radius: 12px; cursor: pointer;" onclick="window.open(this.src)">`;
    } else {
      // Text message
      messageContent = msg.text;
    }

    messageDiv.innerHTML = `
      <div class="message-bubble">
        <strong class="message-sender">${msg.sender || (msg.type === "sent" ? "You" : "Bot")}</strong>
        <p>${messageContent}</p>
        <small class="timestamp">${msg.time || ""}</small>
      </div>
      ${msg.type === "sent" ? '<button class="delete-msg" data-index="' + index + '">🗑️</button>' : ""}
    `;

    messagesContainer.appendChild(messageDiv);
  });

  // Add delete event listeners
  document.querySelectorAll(".delete-msg").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(btn.getAttribute("data-index"));
      if (!isNaN(index)) {
        groupMessages.splice(index, 1);
        saveMessages();
        renderMessages();
      }
    });
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// SAVE MESSAGES TO STORAGE
function saveMessages() {
  localStorage.setItem(group, JSON.stringify(groupMessages));
}

// =========================
// SEND MESSAGE
// =========================
if (chatForm) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = chatInput.value.trim();
    if (!text) return;

    // Create new message object
    const newMsg = {
      text: text,
      type: "sent",
      sender: currentUser?.username || currentUser?.name || "You",
      time: new Date().toLocaleTimeString(),
      isImage: false,
      isGif: false,
    };

    groupMessages.push(newMsg);
    saveMessages();
    renderMessages();

    chatInput.value = "";

    // =========================
    // AUTO RESPOND ONLY ON FIRST MESSAGE
    // =========================
    if (!hasSentWelcomeMessage && currentUser) {
      hasSentWelcomeMessage = true;
      localStorage.setItem(welcomeKey, "true");

      const userName = currentUser.name || currentUser.username || "there";
      const welcomeMessages = [
        `👋 Welcome to the ${group} group, ${userName}! We're glad to have you here!`,
        `🎉 Hey ${userName}! Welcome to ${group}! Feel free to share your thoughts.`,
        `💬 ${userName} joined the chat! Welcome to ${group}!`,
        `✨ Welcome ${userName}! This is the ${group} group chat. Enjoy your stay!`,
        `🚀 ${userName} has arrived! Welcome to the ${group} community!`,
        `🌟 A warm welcome to ${userName} in ${group}! Let's have great discussions!`,
      ];

      const randomWelcome =
        welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

      setTimeout(() => {
        const welcomeMsg = {
          text: randomWelcome,
          type: "received",
          sender: "Bot 🤖",
          time: new Date().toLocaleTimeString(),
          isImage: false,
        };

        groupMessages.push(welcomeMsg);
        saveMessages();
        renderMessages();

        setTimeout(() => {
          const helpMsg = {
            text: `💡 Tip: You can send images 📸, GIFs 🎥, use emojis 😀, and delete your own messages!`,
            type: "received",
            sender: "Bot 🤖",
            time: new Date().toLocaleTimeString(),
            isImage: false,
          };

          groupMessages.push(helpMsg);
          saveMessages();
          renderMessages();
        }, 1500);
      }, 800);
    }
    // Reply to specific keywords after first message
    else if (hasSentWelcomeMessage) {
      const lowerText = text.toLowerCase();

      setTimeout(() => {
        let response = null;

        if (
          lowerText.includes("hello") ||
          lowerText.includes("hi") ||
          lowerText.includes("hey")
        ) {
          response = `Hello ${currentUser?.name || "there"}! How can I help you today? 👋`;
        } else if (
          lowerText.includes("thanks") ||
          lowerText.includes("thank you")
        ) {
          response = "You're welcome! 😊 Happy to help!";
        } else if (lowerText.includes("bye") || lowerText.includes("goodbye")) {
          response = "Goodbye! Come back soon! 👋";
        } else if (lowerText.includes("help")) {
          response = `I can help you with:\n• Sending messages\n• Sharing images 📸\n• Sending GIFs 🎥\n• Using emojis 😀\n• Deleting your messages (click 🗑️)`;
        } else if (lowerText.includes("gif")) {
          response = "Try clicking the 🎥 GIF button to send a fun GIF!";
        }

        if (response) {
          const replyMsg = {
            text: response,
            type: "received",
            sender: "Bot 🤖",
            time: new Date().toLocaleTimeString(),
            isImage: false,
          };

          groupMessages.push(replyMsg);
          saveMessages();
          renderMessages();
        }
      }, 500);
    }
  });
}

// =========================
// TYPING INDICATOR
// =========================
if (chatInput) {
  chatInput.addEventListener("input", () => {
    if (!typing) return;

    typing.textContent = "Someone is typing...";

    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {
      typing.textContent = "";
    }, 1000);
  });
}

// =========================
// EMOJI BUTTON
// =========================
if (emojiBtn) {
  emojiBtn.addEventListener("click", () => {
    chatInput.value += "😀";
    chatInput.focus();
  });
}

// =========================
// IMAGE UPLOAD - FIXED
// =========================
if (imageUpload) {
  imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB!");
      imageUpload.value = "";
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      imageUpload.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const newMsg = {
        text: reader.result,
        type: "sent",
        sender: currentUser?.username || currentUser?.name || "You",
        time: new Date().toLocaleTimeString(),
        isImage: true,
        isGif: false,
      };

      groupMessages.push(newMsg);
      saveMessages();
      renderMessages();

      // Bot acknowledges image
      setTimeout(() => {
        const ackMsg = {
          text: "Nice image! 📸 Thanks for sharing!",
          type: "received",
          sender: "Bot 🤖",
          time: new Date().toLocaleTimeString(),
          isImage: false,
        };

        groupMessages.push(ackMsg);
        saveMessages();
        renderMessages();
      }, 500);
    };

    reader.readAsDataURL(file);

    // Clear the file input
    imageUpload.value = "";
  });
}

// =========================
// CREATE GROUP
// =========================
if (createGroup && newGroup) {
  createGroup.addEventListener("click", () => {
    const name = newGroup.value.trim();
    if (!name) {
      alert("Please enter a group name!");
      return;
    }

    const existingGroups = document.querySelectorAll(".groups .group h4 a");
    let groupExists = false;
    existingGroups.forEach((link) => {
      if (link.textContent.toLowerCase() === name.toLowerCase()) {
        groupExists = true;
      }
    });

    if (groupExists) {
      alert("A group with this name already exists!");
      return;
    }

    const groupDiv = document.createElement("div");
    groupDiv.classList.add("group");

    groupDiv.innerHTML = `
      <div style="font-size: 30px;">💬</div>
      <h4>
        <a href="Chat.html?group=${encodeURIComponent(name)}">
          ${escapeHtml(name)}
        </a>
      </h4>
      <p>A new group for discussions about ${escapeHtml(name)}</p>
      <button class="join-group-btn">Join Group</button>
    `;

    document.querySelector(".groups").appendChild(groupDiv);

    newGroup.value = "";

    if (!localStorage.getItem(name)) {
      localStorage.setItem(name, JSON.stringify([]));
    }

    alert(`Group "${name}" created successfully! 🎉`);
  });
}

// =========================
// JOIN GROUP BUTTONS
// =========================
function attachJoinGroupEvents() {
  document.querySelectorAll(".join-group-btn").forEach((btn) => {
    btn.removeEventListener("click", handleJoinGroup);
    btn.addEventListener("click", handleJoinGroup);
  });
}

function handleJoinGroup(e) {
  const groupCard = e.target.closest(".group");
  const groupLink = groupCard.querySelector("h4 a");
  const groupName = groupLink.textContent;

  if (currentUser) {
    let joinedGroups =
      JSON.parse(localStorage.getItem(`${currentUser.email}_joined_groups`)) ||
      [];
    if (!joinedGroups.includes(groupName)) {
      joinedGroups.push(groupName);
      localStorage.setItem(
        `${currentUser.email}_joined_groups`,
        JSON.stringify(joinedGroups),
      );
      alert(`You joined ${groupName}! 🎉`);
    } else {
      alert(`You're already a member of ${groupName}!`);
    }
  } else {
    alert("Please login to join groups!");
  }
}

// =========================
// HELPER: ESCAPE HTML
// =========================
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// =========================
// ADD CSS STYLES
// =========================
function addStyles() {
  if (!document.querySelector("#chatStyles")) {
    const style = document.createElement("style");
    style.id = "chatStyles";
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-in {
        animation: fadeIn 0.3s ease;
      }
      
      .message {
        margin-bottom: 15px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
      
      .message.sent {
        justify-content: flex-end;
      }
      
      .message-bubble {
        max-width: 70%;
        padding: 10px 15px;
        border-radius: 18px;
        position: relative;
      }
      
      .message.sent .message-bubble {
        background: linear-gradient(135deg, #0052cc, #1e90ff);
        color: white;
        border-bottom-right-radius: 5px;
      }
      
      .message.received .message-bubble {
        background: #1e293b;
        color: #f1f5f9;
        border-bottom-left-radius: 5px;
      }
      
      .message-sender {
        font-size: 12px;
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
        opacity: 0.8;
      }
      
      .timestamp {
        font-size: 10px;
        opacity: 0.6;
        display: block;
        margin-top: 5px;
      }
      
      .delete-msg {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.5;
        transition: opacity 0.3s;
        padding: 5px;
      }
      
      .delete-msg:hover {
        opacity: 1;
      }
      
      .join-group-btn {
        margin-top: 10px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #0052cc, #1e90ff);
        border: none;
        border-radius: 20px;
        color: white;
        cursor: pointer;
        font-size: 12px;
      }
      
      .join-group-btn:hover {
        transform: translateY(-2px);
      }
      
      /* GIF Picker Styles */
      #gif-btn {
        background: #30363d;
        border: none;
        color: white;
        padding: 12px 18px;
        border-radius: 14px;
        cursor: pointer;
        transition: 0.3s;
        font-size: 1rem;
      }
      
      #gif-btn:hover {
        background: #1e90ff;
        transform: scale(1.05);
      }
      
      .gif-picker {
        position: absolute;
        bottom: 80px;
        right: 20px;
        background: #161b22;
        border: 1px solid #1e90ff;
        border-radius: 16px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        flex-direction: column;
      }
      
      .gif-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #30363d;
        background: #1e293b;
        border-radius: 16px 16px 0 0;
      }
      
      .gif-picker-header h4 {
        color: #58a6ff;
        margin: 0;
      }
      
      #close-gif-picker {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 5px 10px;
      }
      
      #close-gif-picker:hover {
        color: #ff4757;
      }
      
      .gif-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 15px;
      }
      
      .gif-item {
        background: #21262d;
        border-radius: 12px;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        transition: 0.3s;
        border: 1px solid transparent;
      }
      
      .gif-item:hover {
        transform: translateY(-3px);
        border-color: #1e90ff;
        background: #1e293b;
      }
      
      .gif-emoji {
        font-size: 40px;
        margin-bottom: 5px;
      }
      
      .gif-name {
        font-size: 12px;
        color: #c9d1d9;
      }
      
      .gif-label {
        font-size: 10px;
        color: #58a6ff;
        margin-top: 5px;
      }
      
      .gif-message {
        max-width: 200px;
      }
      
      /* Position relative for chat input */
      .chat_input {
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }
}

// =========================
// INITIAL RENDER
// =========================
addStyles();
renderMessages();
attachJoinGroupEvents();

// Add online users count (mock data)
const onlineUsers = document.querySelector(".online-users");
if (onlineUsers) {
  setInterval(() => {
    const randomUsers = Math.floor(Math.random() * 20) + 1;
    onlineUsers.innerHTML = `<span class="online-dot"></span> ${randomUsers} users online`;
  }, 30000);
}

console.log(`✅ Chat initialized for group: ${group}`);
console.log(`Welcome message sent: ${hasSentWelcomeMessage}`);
