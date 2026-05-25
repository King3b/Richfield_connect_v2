let profileStats = JSON.parse(localStorage.getItem("profileStats")) || {
  likes: 0,
  comments: 0,
};

// =========================
// GET POSTS FROM DOM
// =========================
const postElements = document.querySelectorAll(".post");

// =========================
// LOOP POSTS
// =========================
postElements.forEach((post, index) => {
  const likeBtn = post.querySelector(".like-btn");
  const likeCount = post.querySelector(".like-count");

  const commentBtn = post.querySelector(".comment-btn");

  const commentsBox = post.querySelector(".comments_users");

  const commentTextarea = post.querySelector("textarea");

  const postCommentBtn = post.querySelector(".user_commenting button");

  const commentCounter = post.querySelector(".comment-count");

  // SAFETY CHECKS
  if (!likeBtn || !likeCount) return;

  // =========================
  // LOAD LIKES
  // =========================
  let likes = Number(localStorage.getItem(`likes-${index}`)) || 0;

  likeCount.textContent = `${likes} Likes`;

  likeBtn.addEventListener("click", () => {
    likes++;

    likeCount.textContent = `${likes} Likes`;

    localStorage.setItem(`likes-${index}`, likes);

    profileStats.likes++;
    localStorage.setItem("profileStats", JSON.stringify(profileStats));
  });

  // =========================
  // TOGGLE COMMENTS
  // =========================
  if (commentBtn && commentsBox) {
    commentBtn.addEventListener("click", () => {
      commentsBox.classList.toggle("active");
    });
  }

  // =========================
  // LOAD COMMENT COUNT
  // =========================
  let savedComments = Number(localStorage.getItem(`comments-${index}`)) || 0;

  if (commentCounter) {
    commentCounter.textContent = savedComments;
  }

  // =========================
  // POST COMMENT
  // =========================
  if (postCommentBtn && commentTextarea) {
    postCommentBtn.addEventListener("click", () => {
      const text = commentTextarea.value.trim();

      if (!text) return;

      const commentDiv = document.createElement("div");

      commentDiv.classList.add("comment");

      const time = new Date().toLocaleTimeString();

      commentDiv.innerHTML = `
        <p class="cUser">@You</p>
        <p class="cTime">${time}</p>
        <p class="cMsg">${text}</p>

        <button class="like-btn">Like</button>
        <button class="reply-btn">Reply</button>
      `;

      commentsBox.appendChild(commentDiv);

      commentTextarea.value = "";

      // UPDATE COUNT
      savedComments++;
      localStorage.setItem(`comments-${index}`, savedComments);

      if (commentCounter) {
        commentCounter.textContent = savedComments;
      }

      profileStats.comments++;
      localStorage.setItem("profileStats", JSON.stringify(profileStats));
    });
  }
});
