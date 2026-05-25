// SIMPLE WORKING VERSION - Test this first
$(document).ready(function () {
  console.log("✅ feed.js loaded successfully");

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("Current user:", currentUser);

  if (!currentUser) {
    alert("Please login first!");
    window.location.href = "logIn.html";
    return;
  }

  // Show welcome message
  $("#welcomeUser").text(`Welcome ${currentUser.name} 👋`);

  // =========================
  // LOGOUT FUNCTIONALITY
  // =========================
  $("#logout").on("click", function (e) {
    e.preventDefault();

    // Show confirmation dialog
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      // Clear all user data from localStorage
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("richfieldUser");

      // Optional: Clear session-specific data but keep posts and messages
      // You can choose to keep or clear specific items

      // Show logout message
      alert("✅ You have been successfully logged out!");

      // Redirect to login page
      window.location.href = "logIn.html";
    }
  });

  // Optional: Add hover effect for logout button
  $("#logout")
    .css({
      background: "linear-gradient(135deg, #ff4757, #ff6b81)",
      border: "none",
      color: "white",
      padding: "8px 16px",
      "border-radius": "20px",
      cursor: "pointer",
      "font-weight": "600",
      transition: "all 0.3s ease",
      "margin-left": "10px",
    })
    .hover(
      function () {
        $(this).css({
          transform: "translateY(-2px)",
          "box-shadow": "0 5px 15px rgba(255, 71, 87, 0.3)",
        });
      },
      function () {
        $(this).css({
          transform: "translateY(0)",
          "box-shadow": "none",
        });
      },
    );

  // =========================
  // HANDLE CREATE POST WITH IMAGE
  // =========================
  $("#post-form").on("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted!");

    // Get form values
    const topic = $(this).find("input[type='text']").first().val();
    const content = $("#post_content").val();
    const imageFile = $(this).find("input[type='file']")[0].files[0];

    console.log("Topic:", topic);
    console.log("Content:", content);
    console.log("Image file:", imageFile);

    // Validate
    if (!topic || !content) {
      alert("Please fill in both topic and content!");
      return;
    }

    // Handle image
    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        alert("Please select a valid image file!");
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB!");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        createPostElement(topic, content, imageUrl, currentUser);
      };
      reader.readAsDataURL(imageFile);
    } else {
      createPostElement(topic, content, "", currentUser);
    }
  });

  // Function to create and add post to page
  function createPostElement(topic, content, imageUrl, user) {
    const timeAgo = "just now";
    const username = user.username || `@${user.name}`;

    // Create HTML exactly like your existing posts
    const postHtml = `
            <div class="post">
                <div class="post-heading">
                    <img src="assets/images/default-avatar.png" alt="profile picture" onerror="this.src='https://via.placeholder.com/40'" />
                    <div class="post_title">
                        <p class="cUser">${escapeHtml(username)}</p>
                        <h6 class="cTopic">${escapeHtml(topic)}</h6>
                        <p class="cTime">${timeAgo}</p>
                    </div>
                </div>
                <p class="cMsg">${escapeHtml(content)}</p>
                ${imageUrl ? `<img src="${imageUrl}" alt="subject picture" />` : ""}
                <div class="react_buttons">
                    <span class="like-count">0 likes</span>
                    <button class="like-btn">👍 Like</button>
                    <span class="comment_icon"></span>
                    <button class="comment-btn">Comments (<span class="comment-count">0</span>)</button>
                </div>
                
                <div id="comments_users" style="display: none;">
                    <div class="comment">
                        <p class="cMsg" style="color: #666; text-align: center; padding: 10px;">No comments yet. Be the first to comment! 💬</p>
                    </div>
                </div>

                <div class="user_commenting">
                    <textarea class="comment-textarea" placeholder="Write a comment..."></textarea>
                    <button class="submit-comment-btn" type="submit">post</button>
                </div>
            </div>
        `;

    // Add to the beginning of feed (right after the feed h2, before create_Post)
    $(".feed .create_Post").before(postHtml);

    // Clear form
    $("#post-form input[type='text']").val("");
    $("#post_content").val("");
    $("#post-form input[type='file']").val("");

    // Attach event handlers to new post
    attachEventHandlers();

    alert("✅ Post created successfully!");

    // Scroll to new post
    $("html, body").animate(
      {
        scrollTop: $(".post").first().offset().top - 100,
      },
      500,
    );
  }

  // =========================
  // HANDLE COMMENTS
  // =========================
  function attachEventHandlers() {
    // Comment button - toggle comments
    $(".comment-btn")
      .off("click")
      .on("click", function () {
        $(this).closest(".post").find("#comments_users").slideToggle();
      });

    // Submit comment
    $(".submit-comment-btn")
      .off("click")
      .on("click", function () {
        const postDiv = $(this).closest(".post");
        const commentText = postDiv.find(".comment-textarea").val();

        if (!commentText.trim()) {
          alert("Please enter a comment!");
          return;
        }

        const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const username = currentUser.username || `@${currentUser.name}`;
        const timeAgo = "just now";

        const commentHtml = `
                <div class="comment">
                    <p class="cUser">${escapeHtml(username)}</p>
                    <p class="cTime">${timeAgo}</p>
                    <p class="cMsg">${escapeHtml(commentText)}</p>
                    <button class="like-btn">like</button>
                    <button class="reply-btn">reply</button>
                </div>
            `;

        const commentsDiv = postDiv.find("#comments_users");
        commentsDiv.empty();
        commentsDiv.append(commentHtml);

        // Update comment count
        const commentBtn = postDiv.find(".comment-btn");
        const currentCount = parseInt(commentBtn.find(".comment-count").text());
        commentBtn.find(".comment-count").text(currentCount + 1);

        // Clear textarea
        postDiv.find(".comment-textarea").val("");

        alert("✅ Comment posted!");
      });

    // Like button
    $(".like-btn")
      .off("click")
      .on("click", function () {
        const likeSpan = $(this).siblings(".like-count");
        let likeText = likeSpan.text();
        let likes = parseInt(likeText) || 0;

        if ($(this).hasClass("liked")) {
          likes--;
          $(this).removeClass("liked");
          $(this).html("👍 Like");
          likeSpan.text(likes + (likes === 1 ? " like" : " likes"));
        } else {
          likes++;
          $(this).addClass("liked");
          $(this).html("❤️ Liked");
          likeSpan.text(likes + (likes === 1 ? " like" : " likes"));
        }
      });
  }

  // =========================
  // HELPER FUNCTIONS
  // =========================
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize event handlers for existing posts
  attachEventHandlers();

  // =========================
  // GROUP SEARCH FUNCTIONALITY
  // =========================
  $(".group_search button").on("click", function () {
    const searchTerm = $(".group_search input").val().toLowerCase();
    $(".groups .group").each(function () {
      const groupName = $(this).find("h4 a").text().toLowerCase();
      if (groupName.includes(searchTerm)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // Group category filters
  $(".group_categories button").on("click", function () {
    const category = $(this).text().toLowerCase();
    $(".groups .group").show();

    if (category === "academic") {
      $(".groups .group").each(function () {
        if (!$(this).find("h4 a").text().toLowerCase().includes("math")) {
          $(this).hide();
        }
      });
    } else if (category === "clubs") {
      $(".groups .group").each(function () {
        if (!$(this).find("h4 a").text().toLowerCase().includes("computer")) {
          $(this).hide();
        }
      });
    }
  });

  // Join group buttons
  $(document).on("click", ".join-group-btn", function () {
    const groupName = $(this).closest(".group").find("h4 a").text();
    alert(`You joined ${groupName}! 🎉`);
  });

  console.log("✅ All event handlers loaded!");
});
