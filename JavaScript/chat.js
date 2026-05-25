const params = new URLSearchParams(window.location.search);
const group = params.get("group") || "General";

// ELEMENTS
const groupName = document.getElementById("group-name");
const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-message");
const typing = document.getElementById("typing");
const emojiBtn = document.getElementById("emojiBtn");
const imageUpload = document.getElementById("imageUpload");
const createGroup = document.getElementById("createGroup");
const newGroup = document.getElementById("newGroup");

// SET TITLE
groupName.textContent = `${group} Group Chat`;

// LOAD MESSAGES
let groupMessages = JSON.parse(localStorage.getItem(group)) || [];

// =========================
// RENDER MESSAGES
// =========================
function renderMessages() {
  messagesContainer.innerHTML = "";

  groupMessages.forEach((msg) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", msg.type);

    const time = msg.time || "";

    messageDiv.innerHTML = `
      <p>${msg.text}</p>
      <small class="timestamp">${time}</small>
      <button class="delete-msg">Delete</button>
    `;

    // DELETE
    messageDiv.querySelector(".delete-msg").addEventListener("click", () => {
      groupMessages = groupMessages.filter((m) => m !== msg);

      saveMessages();
      renderMessages();
    });

    messagesContainer.appendChild(messageDiv);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// SAVE
function saveMessages() {
  localStorage.setItem(group, JSON.stringify(groupMessages));
}

// INITIAL
renderMessages();

// =========================
// SEND MESSAGE
// =========================
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = chatInput.value.trim();
  if (!text) return;

  const newMsg = {
    text,
    type: "sent",
    time: new Date().toLocaleTimeString(),
  };

  groupMessages.push(newMsg);
  saveMessages();
  renderMessages();

  chatInput.value = "";

  // FAKE BOT REPLY
  setTimeout(() => {
    groupMessages.push({
      text: `Welcome to ${group} 👋`,
      type: "received",
      time: new Date().toLocaleTimeString(),
    });

    saveMessages();
    renderMessages();
  }, 800);
});

// =========================
// TYPING INDICATOR
// =========================
chatInput.addEventListener("input", () => {
  if (!typing) return;

  typing.textContent = "Someone is typing...";

  clearTimeout(window.typingTimeout);

  window.typingTimeout = setTimeout(() => {
    typing.textContent = "";
  }, 1000);
});

// =========================
// EMOJI BUTTON
// =========================
if (emojiBtn) {
  emojiBtn.addEventListener("click", () => {
    chatInput.value += "🔥";
    chatInput.focus();
  });
}

// =========================
// IMAGE UPLOAD
// =========================
if (imageUpload) {
  imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      groupMessages.push({
        text: `<img src="${reader.result}" style="width:200px;border-radius:10px;">`,
        type: "sent",
        time: new Date().toLocaleTimeString(),
      });

      saveMessages();
      renderMessages();
    };

    reader.readAsDataURL(file);
  });
}

// =========================
// CREATE GROUP
// =========================
if (createGroup) {
  createGroup.addEventListener("click", () => {
    const name = newGroup.value.trim();
    if (!name) return;

    const groupDiv = document.createElement("div");
    groupDiv.classList.add("group");

    groupDiv.innerHTML = `
      <h4>
        <a href="Chat.html?group=${name}">
          ${name}
        </a>
      </h4>
    `;

    document.querySelector(".groups").appendChild(groupDiv);

    newGroup.value = "";
  });
}
