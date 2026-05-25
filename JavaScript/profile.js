$(document).ready(function () {
  // =========================
  // GLOBAL VARIABLES
  // =========================
  let currentUser = null;
  let database = null;
  let userPosts = [];

  // =========================
  // LOAD CURRENT USER FROM DATABASE
  // =========================
  async function loadCurrentUser() {
    // First try to get from loggedInUser
    currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!currentUser) {
      window.location.href = "logIn.html";
      return false;
    }

    // Load full database to get latest user data
    const storedDB = localStorage.getItem("richfield_database");
    if (storedDB) {
      database = JSON.parse(storedDB);
      // Find the user in the database
      const dbUser = database.users?.find((u) => u.email === currentUser.email);
      if (dbUser) {
        currentUser = dbUser;
        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
        localStorage.setItem("richfieldUser", JSON.stringify(currentUser));
      }
    }

    // Load user's posts
    if (database && database.posts) {
      userPosts = database.posts.filter(
        (post) => post.userId === currentUser.email,
      );
    }

    return true;
  }

  // =========================
  // DISPLAY PROFILE DATA
  // =========================
  function displayProfileData() {
    if (!currentUser) return;

    // ===== PROFILE HERO SECTION =====
    // Name
    $("#profileName").text(currentUser.name || "Add your name");

    // Username
    $("#profileUsername").text(currentUser.username || "@username");

    // Course
    $("#profileCourse").text(
      currentUser.course || currentUser.yearName || "Add course",
    );

    // Academic Year
    $("#profileYear").text(
      currentUser.yearName || currentUser.yearOfStudy || "Add year",
    );

    // Bio
    $("#profileBio").text(currentUser.bio || "Add bio from Edit Profile");

    // Profile Image
    if (currentUser.profileImage) {
      $("#profileImage").attr("src", currentUser.profileImage);
    } else {
      $("#profileImage").attr("src", "assets/images/default-avatar.png");
    }

    // Banner Image
    if (currentUser.bannerImage) {
      $("#bannerImage").attr("src", currentUser.bannerImage);
    } else {
      $("#bannerImage").attr("src", "assets/images/defaultBanner.jpg");
    }

    // ===== OVERVIEW SECTION =====
    // Personal Info
    $("#overviewName").text(currentUser.name || "Please edit your full name");
    $("#overviewSurname").text(currentUser.surname || "Please add surname");
    $("#overviewStudentID").text(currentUser.studentId || "Not provided");
    $("#overviewEmail").text(currentUser.email || "Not provided");
    $("#overviewGender").text(currentUser.gender || "Not specified");
    $("#overviewLocation").text(currentUser.location || "Please add location");

    // GitHub Link
    if (currentUser.github) {
      $("#githubLink").attr("href", currentUser.github).text("GitHub Profile");
    } else {
      $("#githubLink").attr("href", "#").text("Add GitHub");
    }

    // LinkedIn Link
    if (currentUser.linkedin) {
      $("#linkedinLink")
        .attr("href", currentUser.linkedin)
        .text("LinkedIn Profile");
    } else {
      $("#linkedinLink").attr("href", "#").text("Add LinkedIn");
    }

    // ===== HOBBIES =====
    const hobbies = currentUser.hobbies || [];
    if (hobbies.length > 0) {
      const $hobbyContainer = $(".card").eq(1).find("ul");
      $hobbyContainer.empty();
      hobbies.forEach((hobby) => {
        $hobbyContainer.append(`
          <li>
            <span class="material-symbols-rounded">sports_esports</span>
            <div>
              <h4>${escapeHtml(hobby)}</h4>
            </div>
          </li>
        `);
      });
    } else {
      $("#overviewhobby").text("No hobbies added yet");
    }

    // ===== INTERESTS =====
    const interests = currentUser.interests || [];
    if (interests.length > 0) {
      const $interestContainer = $(".card").eq(2).find("ul");
      $interestContainer.empty();
      interests.forEach((interest) => {
        $interestContainer.append(`
          <li>
            <span class="material-symbols-rounded">favorite</span>
            <div>
              <h4>${escapeHtml(interest)}</h4>
            </div>
          </li>
        `);
      });
    } else {
      $("#overviewIntrest").text("No interests added yet");
    }

    // ===== EDUCATION SECTION =====
    // Campus
    $("#overviewCampus").text(currentUser.campusName || "Richfield");

    // Year
    $("#overviewyear").text(
      currentUser.yearName || currentUser.yearOfStudy || "Not specified",
    );

    // Achievements
    const achievements = currentUser.achievements || [];
    if (achievements.length > 0) {
      $("#overviewAchievments").text(achievements.join(", "));
    } else {
      $("#overviewAchievments").text("No achievements added yet");
    }

    // Skills
    const skills = currentUser.skills || [];
    if (skills.length > 0) {
      const $skillContainer = $(".card").eq(4).find("ul").first();
      skills.forEach((skill) => {
        $skillContainer.append(`<li><p>• ${escapeHtml(skill)}</p></li>`);
      });
    }

    // ===== PROFILE STATS =====
    // Update post count
    $(".profile_stats div").eq(2).find("h4").text(userPosts.length);

    // Followers/Following (placeholder - can be implemented later)
    $("#followers").text(currentUser.followersCount || 0);
    $("#following").text(currentUser.followingCount || 0);

    // ===== CONNECTIONS SECTION =====
    // Connections
    const connections = currentUser.connections || [];
    if (connections.length > 0) {
      const $connectionsContainer = $("#connections");
      $connectionsContainer.empty();
      connections.forEach((conn) => {
        $connectionsContainer.append(`<li>${escapeHtml(conn)}</li>`);
      });
    }

    // Followers list
    const followers = currentUser.followersList || [];
    if (followers.length > 0) {
      const $followersContainer = $(".connections_grid .card").eq(1).find("ul");
      $followersContainer.empty();
      followers.forEach((follower) => {
        $followersContainer.append(`<li>${escapeHtml(follower)}</li>`);
      });
    }

    // Following list
    const following = currentUser.followingList || [];
    if (following.length > 0) {
      const $followingContainer = $(".connections_grid .card").eq(2).find("ul");
      $followingContainer.empty();
      following.forEach((follow) => {
        $followingContainer.append(`<li>${escapeHtml(follow)}</li>`);
      });
    }

    // Groups joined
    const groups = currentUser.groups || [];
    if (groups.length > 0) {
      const $groupsContainer = $("#joined_groups");
      $groupsContainer.empty();
      groups.forEach((group) => {
        $groupsContainer.append(`<li>${escapeHtml(group)}</li>`);
      });
    }

    // ===== ACTIVITY SECTION =====
    // User's posts
    if (userPosts.length > 0) {
      const $postsContainer = $(".activity_grid .activity_card")
        .eq(0)
        .find("ul");
      $postsContainer.empty();
      userPosts.slice(0, 5).forEach((post) => {
        $postsContainer.append(`
          <li>
            <h5>${escapeHtml(post.topic)}</h5>
            ${post.image ? `<img src="${post.image}" alt="post img" style="width: 100%; border-radius: 12px; margin: 10px 0;" />` : ""}
            <p>${escapeHtml(post.content.substring(0, 100))}${post.content.length > 100 ? "..." : ""}</p>
            <small>${getTimeAgo(post.time)}</small>
          </li>
        `);
      });
    }

    // Liked posts
    const likedPostIds = currentUser.likedPosts || [];
    if (database && database.posts && likedPostIds.length > 0) {
      const likedPosts = database.posts.filter((post) =>
        likedPostIds.includes(post.id),
      );
      const $likedContainer = $(".activity_grid .activity_card")
        .eq(1)
        .find("ul");
      $likedContainer.empty();
      likedPosts.slice(0, 5).forEach((post) => {
        $likedContainer.append(`
          <li>
            <h5>${escapeHtml(post.topic)}</h5>
            ${post.image ? `<img src="${post.image}" alt="post img" style="width: 100%; border-radius: 12px; margin: 10px 0;" />` : ""}
            <p>${escapeHtml(post.content.substring(0, 100))}${post.content.length > 100 ? "..." : ""}</p>
            <small>by ${escapeHtml(post.username)}</small>
          </li>
        `);
      });
    }
  }

  // =========================
  // PROFILE COMPLETION PERCENTAGE
  // =========================
  function calculateCompletion() {
    const fields = [
      currentUser?.name,
      currentUser?.surname,
      currentUser?.username,
      currentUser?.bio,
      currentUser?.course || currentUser?.yearName,
      currentUser?.location,
      currentUser?.github,
      currentUser?.linkedin,
      currentUser?.profileImage,
      currentUser?.interests?.length > 0,
      currentUser?.hobbies?.length > 0,
      currentUser?.skills?.length > 0,
    ];

    const completedFields = fields.filter(Boolean).length;
    const completion = Math.floor((completedFields / fields.length) * 100);

    $("#completionPercent").text(`${completion}%`);
    $("#completionFill").css("width", `${completion}%`);

    // Change color based on completion
    if (completion < 30) {
      $("#completionFill").css(
        "background",
        "linear-gradient(90deg, #ff6b6b, #ff4757)",
      );
    } else if (completion < 70) {
      $("#completionFill").css(
        "background",
        "linear-gradient(90deg, #ffa502, #ff6348)",
      );
    } else {
      $("#completionFill").css(
        "background",
        "linear-gradient(90deg, #0052cc, #1e90ff)",
      );
    }
  }

  // =========================
  // THEME MODE
  // =========================
  function setupTheme() {
    const themeBtn = $("#themeToggle");

    if (localStorage.getItem("theme") === "light") {
      $("body").addClass("light_mode");
      themeBtn.text("☀");
    }

    themeBtn.off("click").on("click", function () {
      $("body").toggleClass("light_mode");

      if ($("body").hasClass("light_mode")) {
        localStorage.setItem("theme", "light");
        $(this).text("☀");
      } else {
        localStorage.setItem("theme", "dark");
        $(this).text("🌙");
      }
    });
  }

  // =========================
  // UPDATE STATS FROM DATABASE
  // =========================
  function updateStats() {
    if (!database || !currentUser) return;

    // Calculate total likes on user's posts
    let totalLikes = 0;
    userPosts.forEach((post) => {
      totalLikes += post.likeCount || 0;
    });

    // Calculate total comments on user's posts
    let totalComments = 0;
    userPosts.forEach((post) => {
      const postComments = database.comments?.[post.id] || [];
      totalComments += postComments.length;
    });

    // Update stats display if elements exist
    if ($("#profileLikes").length) $("#profileLikes").text(totalLikes);
    if ($("#profileComments").length) $("#profileComments").text(totalComments);
  }

  // =========================
  // HELPER: Get time ago string
  // =========================
  function getTimeAgo(timestamp) {
    if (!timestamp) return "recently";
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  // =========================
  // HELPER: Escape HTML
  // =========================
  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // =========================
  // REFRESH BUTTON (optional)
  // =========================
  function addRefreshButton() {
    if ($("#refreshProfileBtn").length === 0) {
      const refreshBtn = $(`
        <button id="refreshProfileBtn" style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #0052cc, #1e90ff);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 50px;
          cursor: pointer;
          z-index: 1000;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(0,82,204,0.3);
          font-family: Poppins, sans-serif;
        ">
          🔄 Refresh Profile
        </button>
      `);
      refreshBtn.on("click", function () {
        location.reload();
      });
      $("body").append(refreshBtn);
    }
  }

  // =========================
  // INITIALIZE EVERYTHING
  // =========================
  async function init() {
    const loaded = await loadCurrentUser();
    if (!loaded) return;

    displayProfileData();
    calculateCompletion();
    updateStats();
    setupTheme();
    addRefreshButton();

    console.log("✅ Profile loaded for:", currentUser.name);
  }

  // Start the app
  init();
});
