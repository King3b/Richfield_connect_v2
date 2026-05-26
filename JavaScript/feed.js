$(document).ready(function () {
  console.log("✅ feed.js loaded");

  // ===================================
  // GET CURRENT USER
  // ===================================

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // If user is not logged in
  if (!currentUser) {
    alert("Please login or signup first!");
    window.location.href = "SignUp.html";
    return;
  }

  // Show welcome message
  $("#welcomeUser").text(`Welcome ${currentUser.name} 👋`);

  // ===================================
  // LOAD POSTS WHEN PAGE OPENS
  // ===================================

  loadPosts();

  // ===================================
  // LOGOUT BUTTON
  // ===================================

  $("#logout").on("click", function (e) {
    e.preventDefault();

    const logout = confirm("Are you sure you want to logout?");

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

    // Get form values
    const topic = $("input[type='text']").val();
    const content = $("#post_content").val();
    const imageFile = $("input[type='file']")[0].files[0];

    // Check empty fields
    if (!topic || !content) {
      alert("Please fill everything");
      return;
    }

    // If image exists
    if (imageFile) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imageUrl = e.target.result;

        savePost(topic, content, imageUrl);
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
    // Get old posts
    let posts = JSON.parse(localStorage.getItem("feedPosts")) || [];

    // Create new post object
    const newPost = {
      topic: topic,
      content: content,
      imageUrl: imageUrl,
      username: currentUser.username || `@${currentUser.name}`,
      time: "just now",
    };

    // Add newest post to top
    posts.unshift(newPost);

    // Save posts
    localStorage.setItem("feedPosts", JSON.stringify(posts));

    // Reload posts visually
    $(".post").remove();

    loadPosts();

    // Clear form
    $("#post-form")[0].reset();

    alert("✅ Post created!");
  }

  // ===================================
  // LOAD POSTS
  // ===================================

  function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("feedPosts")) || [];

    posts.forEach(function (post) {
      const postHTML = `
      
      <div class="post">

        <div class="post-heading">

      <img src="${post.profilePic}" alt="profile picture" />

          <div class="post_title">
            <p class="cUser">${escapeHtml(post.username)}</p>

            <h6 class="cTopic">
              ${escapeHtml(post.topic)}
            </h6>

            <p class="cTime">${post.time}</p>
          </div>

        </div>

        <p class="cMsg">
          ${escapeHtml(post.content)}
        </p>

        ${
          post.imageUrl ? `<img src="${post.imageUrl}" alt="post image" />` : ""
        }

        <div class="react_buttons">

          <span class="like-count">0 likes</span>

          <button class="like-btn">
            👍 Like
          </button>

          <button class="comment-btn">
            Comments
            (<span class="comment-count">0</span>)
          </button>

        </div>

        <div class="comments_users" style="display:none;">

          <div class="comment">
            <p class="cMsg">
              No comments yet 💬
            </p>
          </div>

        </div>

        <div class="user_commenting">

          <textarea
            class="comment-textarea"
            placeholder="Write a comment..."
          ></textarea>

          <button class="submit-comment-btn">
            Post
          </button>

        </div>

      </div>
      `;

      $(".feed .create_Post").before(postHTML);
    });

    // Add button events
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
        const likeText = $(this).siblings(".like-count");

        let likes = parseInt(likeText.text()) || 0;

        // If already liked
        if ($(this).hasClass("liked")) {
          likes--;

          $(this).removeClass("liked");

          $(this).text("👍 Like");
        } else {
          likes++;

          $(this).addClass("liked");

          $(this).text("❤️ Liked");
        }

        likeText.text(`${likes} likes`);
      });

    // COMMENT BUTTON
    $(".submit-comment-btn")
      .off("click")
      .on("click", function () {
        const post = $(this).closest(".post");

        const commentText = post.find(".comment-textarea").val();

        // Empty comment
        if (!commentText.trim()) {
          alert("Write something first");
          return;
        }

        const username = currentUser.username || `@${currentUser.name}`;

        const commentHTML = `
        
        <div class="comment">

          <p class="cUser">${username}</p>

          <p class="cTime">just now</p>

          <p class="cMsg">
            ${escapeHtml(commentText)}
          </p>

        </div>
        `;

        const commentsBox = post.find(".comments_users");

        commentsBox.append(commentHTML);

        // Update comment number
        const countElement = post.find(".comment-count");

        let count = parseInt(countElement.text()) || 0;

        count++;

        countElement.text(count);

        // Clear textarea
        post.find(".comment-textarea").val("");

        alert("✅ Comment posted");
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

  // ===================================
  // SAFE TEXT FUNCTION
  // ===================================

  function escapeHtml(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  }

  console.log("✅ Everything loaded!");
});
// ========== ADD THIS TO YOUR FEED.JS ==========

// Make usernames clickable to view profiles
function makeUsernamesClickable() {
  // Make main post usernames clickable
  document.querySelectorAll(".post .cUser").forEach((el) => {
    let username = el.textContent.trim().replace("@", "");
    el.style.cursor = "pointer";
    el.style.transition = "0.3s";
    el.onmouseenter = () => {
      el.style.color = "#1e90ff";
      el.style.textDecoration = "underline";
    };
    el.onmouseleave = () => {
      el.style.color = "";
      el.style.textDecoration = "";
    };
    el.onclick = (e) => {
      e.stopPropagation();
      // Redirect to profile page with username parameter
      window.location.href = `users_profile.html?username=${username}`;
    };
  });

  // Make comment usernames clickable
  document.querySelectorAll("#comments_users .cUser").forEach((el) => {
    let username = el.textContent.trim().replace("@", "");
    el.style.cursor = "pointer";
    el.onclick = (e) => {
      e.stopPropagation();
      window.location.href = `users_profile.html?username=${username}`;
    };
  });

  // Make profile images clickable
  document.querySelectorAll(".post-heading img").forEach((img) => {
    let post = img.closest(".post");
    if (post) {
      let username = post
        .querySelector(".cUser")
        ?.textContent.trim()
        .replace("@", "");
      if (username) {
        img.style.cursor = "pointer";
        img.onclick = () =>
          (window.location.href = `users_profile.html?username=${username}`);
      }
    }
  });
}

// Run when page loads
document.addEventListener("DOMContentLoaded", makeUsernamesClickable);

// Run when new content is added (for comments)
const observer = new MutationObserver(() => makeUsernamesClickable());
observer.observe(document.body, { childList: true, subtree: true });
