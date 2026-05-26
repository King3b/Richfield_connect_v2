// This code loads and displays the user's profile page
$(document).ready(function () {
  let currentUser = null;

  // ========================================
  // 1. LOGIN CHECK
  // ========================================
  function getLoggedInUser() {
    currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!currentUser) {
      window.location.href = "logIn.html";
      return false;
    }
    return true;
  }

  // ========================================
  // 2. PROFILE DATA FETCH
  // ========================================
  function getUserProfileData() {
    const email = currentUser.email;

    const images = JSON.parse(localStorage.getItem("profile_images")) || {};
    const interests = JSON.parse(localStorage.getItem("user_interests")) || {};
    const bio = JSON.parse(localStorage.getItem("user_bio")) || {};

    return {
      images: images[email] || {},
      interests: interests[email] || {},
      bio: bio[email] || {},
    };
  }

  // ========================================
  // 3. SAFE TEXT
  // ========================================
  function makeSafe(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ========================================
  // 4. PROFILE UI
  // ========================================
  function showProfileOnPage() {
    const data = getUserProfileData();
    const images = data.images;
    const interests = data.interests;
    const bio = data.bio;

    // TOP INFO
    $("#profileName").text(
      (currentUser.name || "Add name") + " " + (currentUser.surname || ""),
    );

    $("#profileUsername").text(currentUser.username || "@username");

    $("#profileCourse").text(currentUser.course || "Add course");
    $("#profileYear").text(currentUser.yearOfStudy || "Add year");
    $("#profileBio").text(bio.bio || currentUser.bio || "Add bio");

    // IMAGES
    $("#profileImage").attr(
      "src",
      images.profileImage || "assets/images/defaultProfile.png",
    );

    $("#bannerImage").attr(
      "src",
      images.bannerImage || "assets/images/defaultBanner.jpg",
    );

    // OVERVIEW
    $("#overviewName").text(currentUser.name || "Not set");
    $("#overviewSurname").text(currentUser.surname || "Not set");
    $("#overviewStudentID").text(currentUser.studentId || "Not set");
    $("#overviewEmail").text(currentUser.email || "Not set");
    $("#overviewGender").text(currentUser.gender || "Not set");

    $("#overviewLocation").text(
      bio.location || currentUser.location || "Not set",
    );

    $("#githubLink")
      .attr("href", bio.github || "#")
      .text(bio.github ? "GitHub Profile" : "");

    $("#linkedinLink")
      .attr("href", bio.linkedin || "#")
      .text(bio.linkedin ? "LinkedIn Profile" : "");

    $("#overviewCampus").text(currentUser.campus || "Richfield");

    $("#overviewYear").text(currentUser.yearOfStudy || "Not specified");

    $("#overviewCourse").text(currentUser.course || "Not specified");

    // ========================================
    // LISTS (SAFE LOOPING)
    // ========================================
    function renderList(container, list, icon, emptyText) {
      container.empty();

      if (!Array.isArray(list) || list.length === 0) {
        container.html(`<li>${emptyText}</li>`);
        return;
      }

      list.forEach((item) => {
        container.append(`
          <li>
            <span class="material-symbols-rounded">${icon}</span>
            <div><h4>${makeSafe(item)}</h4></div>
          </li>
        `);
      });
    }

    renderList(
      $("#hobbiesList"),
      interests.hobbies,
      "sports_esports",
      "<p>No hobbies added yet</p>",
    );

    renderList(
      $("#interestsList"),
      interests.interests,
      "favorite",
      "<p>No interests added yet</p>",
    );

    renderList(
      $("#skillsList"),
      interests.skills,
      "code",
      "<p>No skills added yet</p>",
    );

    renderList(
      $("#goalsList"),
      interests.goals,
      "flag",
      "<p>No goals added yet</p>",
    );

    renderList(
      $("#achievementsList"),
      interests.achievements,
      "emoji_events",
      "<p>No achievements added yet</p>",
    );

    // ========================================
    // POSTS COUNT (FIXED)
    // ========================================
    const allPosts = JSON.parse(localStorage.getItem("feedPosts")) || [];

    const myPosts = allPosts.filter((post) => {
      return (
        post.username === currentUser.username ||
        post.userId === currentUser.email
      );
    });

    $("#postsCount").text(myPosts.length);

    calculateProfileCompletion(images, interests, bio);
  }

  // ========================================
  // 5. PROFILE COMPLETION
  // ========================================
  function calculateProfileCompletion(images, interests, bio) {
    const checklist = [
      currentUser.name,
      currentUser.surname,
      currentUser.email,
      bio.bio,
      bio.location,
      bio.github,
      bio.linkedin,
      images.profileImage,
      interests.interests?.length,
      interests.hobbies?.length,
      interests.skills?.length,
      interests.goals?.length,
      interests.achievements?.length,
    ];

    const done = checklist.filter(Boolean).length;
    const percent = Math.floor((done / checklist.length) * 100);

    $("#completionPercent").text(percent + "%");
    $("#completionFill").css("width", percent + "%");
  }

  // ========================================
  // 6. DARK MODE
  // ========================================
  function setupDarkLightMode() {
    const saved = localStorage.getItem("theme");

    if (saved === "light") {
      $("body").addClass("light_mode");
    }

    $("#themeToggle").on("click", function () {
      $("body").toggleClass("light_mode");

      localStorage.setItem(
        "theme",
        $("body").hasClass("light_mode") ? "light" : "dark",
      );
    });
  }

  // ========================================
  // 7. USER STATS (SAFE)
  // ========================================
  function displayUserStats() {
    const key = "user_stats_" + currentUser.email;
    const stats = JSON.parse(localStorage.getItem(key)) || {};

    $("#post_count").text(stats.postCount || 0);
    $("#liked_post").text(stats.likeCount || 0);
    $("#comment_count").text(stats.commentCount || 0);
  }

  // ========================================
  // 8. USER POSTS (FIXED STORAGE NAME)
  // ========================================
  function displayUserPosts() {
    const allPosts = JSON.parse(localStorage.getItem("feedPosts")) || [];

    const myPosts = allPosts.filter(
      (p) =>
        p.username === currentUser.username || p.userId === currentUser.email,
    );

    const box = $("#userPostsList");
    if (!box.length) return;

    box.empty();

    if (myPosts.length === 0) {
      box.html("<li>No posts yet. Go post something 🔥</li>");
      return;
    }

    myPosts.slice(0, 5).forEach((post) => {
      box.append(`
        <li class="post-item">
          <div>📌 ${makeSafe(post.topic)}</div>
          <div>${makeSafe(post.content.substring(0, 80))}</div>
        </li>
      `);
    });
  }

  // ========================================
  // 9. START
  // ========================================
  function startPage() {
    if (!getLoggedInUser()) return;

    showProfileOnPage();
    setupDarkLightMode();

    displayUserStats();
    displayUserPosts();
  }

  startPage();
});
