// ========================================
// SIMPLE GROUP SYSTEM - Groups Stay After Refresh!
// ========================================

$(document).ready(function () {
  console.log("✅ feed.js loaded");
  const GROUPS_KEY = "saved_groups";

  // ===================================
  // GET CURRENT USER
  // ===================================
  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // If user is not logged in
  if (!currentUser) {
    alert("Please login or signup first!");
    window.location.href = "SignUp.html";
    return;
  }

  // Show welcome message
  $("#welcomeUser").text(`Welcome ${currentUser.name} 👋`);

  // ===================================
  // LOAD POSTS AND GROUPS WHEN PAGE OPENS
  // ===================================
  loadPosts();
  loadAllSavedGroups(); // 👈 THIS MAKES GROUPS STAY AFTER REFRESH

  // ===================================
  // LOGOUT BUTTON
  // ===================================
  $("#logout").on("click", function (e) {
    e.preventDefault();
    let logout = confirm("Are you sure you want to logout?");
    if (logout) {
      localStorage.removeItem("loggedInUser");
      alert("✅ Logged out successfully");
      window.location.href = "logIn.html";
    }
  });

  // ===================================
  // CREATE POST
  // ===================================
  $("#post-form").on("submit", function (e) {
    e.preventDefault();

    let topic = $("input[type='text']").first().val();
    let content = $("#post_content").val();
    let imageFile = $("input[type='file']")[0].files[0];

    if (!topic || !content) {
      alert("Please fill everything");
      return;
    }

    if (imageFile) {
      let reader = new FileReader();
      reader.onload = function (e) {
        savePost(topic, content, e.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      savePost(topic, content, "");
    }
  });

  // ===================================
  // SAVE POST TO LOCAL STORAGE
  // ===================================
  function savePost(topic, content, imageUrl) {
    let posts = JSON.parse(localStorage.getItem("feedPosts")) || [];

    let newPost = {
      topic: topic,
      content: content,
      imageUrl: imageUrl,
      username: currentUser.username || "@" + currentUser.name,
      time: "just now",
    };

    posts.unshift(newPost);
    localStorage.setItem("feedPosts", JSON.stringify(posts));

    $(".post").remove();
    loadPosts();
    $("#post-form")[0].reset();

    updateUserStats("post");
    alert("✅ Post created!");
  }

  // ===================================
  // LOAD POSTS
  // ===================================
  function loadPosts() {
    let posts = JSON.parse(localStorage.getItem("feedPosts")) || [];

    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      let postHTML = `
        <div class="post">
          <div class="post-heading">
            <img src="assets/images/default-avatar.png" alt="profile picture" />
            <div class="post_title">
              <p class="cUser">${escapeHtml(post.username)}</p>
              <h6 class="cTopic">${escapeHtml(post.topic)}</h6>
              <p class="cTime">${post.time}</p>
            </div>
          </div>
          <p class="cMsg">${escapeHtml(post.content)}</p>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post image" style="border-radius: 20px; width:100%; max-height:400px; object-fit:cover;" />` : ""}
          <div class="react_buttons">
            <span class="like-count">0 likes</span>
            <button class="like-btn">👍 Like</button>
            <button class="comment-btn">💬 Comments (<span class="comment-count">0</span>)</button>
          </div>
          <div class="comments_users" style="display:none;">
            <div class="comment">
              <p class="cMsg">No comments yet 💬</p>
            </div>
          </div>
          <div class="user_commenting">
            <textarea class="comment-textarea" placeholder="Write a comment..."></textarea>
            <button class="submit-comment-btn">Post</button>
          </div>
        </div>
      `;
      $(".feed .create_Post").before(postHTML);
    }

    attachEvents();
  }

  // ===================================
  // BUTTON EVENTS
  // ===================================
  function attachEvents() {
    // COMMENT TOGGLE
    $(".comment-btn")
      .off("click")
      .on("click", function () {
        $(this).closest(".post").find(".comments_users").slideToggle();
      });

    // LIKE BUTTON
    $(".like-btn")
      .off("click")
      .on("click", function () {
        let likeText = $(this).siblings(".like-count");
        let likes = parseInt(likeText.text()) || 0;

        if ($(this).hasClass("liked")) {
          likes--;
          $(this).removeClass("liked");
          $(this).text("👍 Like");
        } else {
          likes++;
          updateUserStats("like");
          $(this).addClass("liked");
          $(this).text("❤️ Liked");
        }
        likeText.text(likes + " likes");
      });

    // COMMENT BUTTON
    $(".submit-comment-btn")
      .off("click")
      .on("click", function () {
        let post = $(this).closest(".post");
        let commentText = post.find(".comment-textarea").val();

        if (!commentText.trim()) {
          alert("Write something first");
          return;
        }

        let username = currentUser.username || "@" + currentUser.name;
        let commentHTML = `
        <div class="comment">
          <p class="cUser">${username}</p>
          <p class="cTime">just now</p>
          <p class="cMsg">${escapeHtml(commentText)}</p>
        </div>
      `;

        let commentsBox = post.find(".comments_users");
        commentsBox.append(commentHTML);

        let countElement = post.find(".comment-count");
        let count = parseInt(countElement.text()) || 0;
        count++;
        updateUserStats("comment");
        countElement.text(count);

        post.find(".comment-textarea").val("");
        alert("✅ Comment posted");
      });
  }

  function updateUserStats(type) {
    let key = "user_stats_" + currentUser.email;
    let stats = JSON.parse(localStorage.getItem(key)) || {
      postCount: 0,
      likeCount: 0,
      commentCount: 0,
    };

    if (type === "post") stats.postCount++;
    if (type === "like") stats.likeCount++;
    if (type === "comment") stats.commentCount++;

    localStorage.setItem(key, JSON.stringify(stats));
  }

  // ===================================
  // SEARCH GROUPS (EXISTING)
  // ===================================
  $(".group_search button").on("click", function () {
    let search = $(".group_search input").val().toLowerCase();
    $(".groups .group").each(function () {
      let groupName = $(this).find("h4 a").text().toLowerCase();
      if (groupName.includes(search)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // ===================================
  // SEARCH GROUP - CREATE IF NOT EXISTS
  // ===================================
  let searchButton = document.querySelector(".group_search button");
  let searchInput = document.querySelector(".group_search input");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", function () {
      let searchTerm = searchInput.value.trim();
      if (!searchTerm) {
        alert("Please enter a group name to search!");
        return;
      }

      // Check if group exists in the list
      let groupExists = false;
      let existingGroups = document.querySelectorAll(".groups .group h4 a");

      for (let i = 0; i < existingGroups.length; i++) {
        let existingGroupName = existingGroups[i].textContent;
        if (existingGroupName.toLowerCase() === searchTerm.toLowerCase()) {
          groupExists = true;
          window.location.href =
            "Chat.html?group=" + encodeURIComponent(existingGroupName);
          return;
        }
      }

      // If group doesn't exist, ask to create it
      let wantToCreate = confirm(
        "Group '" +
          searchTerm +
          "' does not exist. Would you like to create it?",
      );
      if (wantToCreate) {
        createNewGroup(searchTerm);
        searchInput.value = "";
      }
    });

    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        searchButton.click();
      }
    });
  }

  // ===================================
  // CREATE A NEW GROUP (SAVES TO STORAGE)
  // ===================================
  function createNewGroup(groupNameToCreate) {
    // Check if group already exists
    let existingGroups = document.querySelectorAll(".groups .group h4 a");
    for (let i = 0; i < existingGroups.length; i++) {
      if (
        existingGroups[i].textContent.toLowerCase() ===
        groupNameToCreate.toLowerCase()
      ) {
        alert("A group with this name already exists!");
        return false;
      }
    }

    let groupDesc = prompt(
      "Enter group description:",
      "A new discussion group",
    );
    if (!groupDesc) groupDesc = "A new discussion group";

    // SAVE TO LOCALSTORAGE (THIS MAKES IT PERSIST AFTER REFRESH)
    let groups = JSON.parse(localStorage.getItem(GROUPS_KEY)) || [];
    groups.push({
      name: groupNameToCreate,
      desc: groupDesc,
    });
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));

    // Create the group card on the page
    createGroupCard(groupNameToCreate, groupDesc);

    // Initialize join buttons for the new group
    setupJoinGroupButtons();

    // Create empty message storage for chat
    if (!localStorage.getItem(groupNameToCreate)) {
      localStorage.setItem(groupNameToCreate, JSON.stringify([]));
    }

    alert('Group "' + groupNameToCreate + '" created successfully! 🎉');
    return true;
  }

  // ===================================
  // CREATE GROUP CARD (VISUAL)
  // ===================================
  function createGroupCard(name, desc) {
    let newGroupCard = document.createElement("div");
    newGroupCard.classList.add("group");
    newGroupCard.innerHTML = `
      <div style="font-size: 30px;">💬</div>
      <h4>
        <a href="Chat.html?group=${encodeURIComponent(name)}">
          ${makeSafe(name)}
        </a>
      </h4>
      <p>${makeSafe(desc)}</p>
      <button class="join-group-btn">Join Group</button>
    `;
    document.querySelector(".groups").appendChild(newGroupCard);
  }

  // ===================================
  // LOAD SAVED GROUPS FROM STORAGE (THIS IS THE KEY!)
  // ===================================
  function loadAllSavedGroups() {
    let groups = JSON.parse(localStorage.getItem(GROUPS_KEY)) || [];

    // Clear any existing default groups first (optional)
    // $(".groups .group").remove();

    // Load each saved group
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i];
      createGroupCard(group.name, group.desc);
    }
  }

  // ===================================
  // JOIN GROUP BUTTONS
  // ===================================
  function setupJoinGroupButtons() {
    let joinButtons = document.querySelectorAll(".join-group-btn");
    for (let i = 0; i < joinButtons.length; i++) {
      let button = joinButtons[i];
      button.removeEventListener("click", handleJoinGroup);
      button.addEventListener("click", handleJoinGroup);
    }
  }

  function handleJoinGroup(event) {
    let groupCard = event.target.closest(".group");
    let groupLink = groupCard.querySelector("h4 a");
    let groupNameText = groupLink.textContent;

    if (currentUser) {
      let joinedGroupsKey = currentUser.email + "_joined_groups";
      let joinedGroups =
        JSON.parse(localStorage.getItem(joinedGroupsKey)) || [];

      if (!joinedGroups.includes(groupNameText)) {
        joinedGroups.push(groupNameText);
        localStorage.setItem(joinedGroupsKey, JSON.stringify(joinedGroups));
        alert("You joined " + groupNameText + "! 🎉");
      } else {
        alert("You're already a member of " + groupNameText + "!");
      }
    } else {
      alert("Please login to join groups!");
    }
  }

  // ===================================
  // HELPER FUNCTIONS
  // ===================================
  function makeSafe(text) {
    let tempDiv = document.createElement("div");
    tempDiv.textContent = text;
    return tempDiv.innerHTML;
  }

  function escapeHtml(text) {
    let div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ===================================
  // START EVERYTHING
  // ===================================
  setupJoinGroupButtons();

  console.log("✅ Everything loaded!");
});
