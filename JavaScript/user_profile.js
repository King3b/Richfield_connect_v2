// ========== USER DATABASE ==========
const users = [
  {
    userId: "1779721048475abcxyz",
    name: "Williams",
    surname: "Howdy",
    username: "WilliamsHowdy",
    email: "williams.howdy@example.com",
    studentId: "415789234",
    gender: "male",
    campus: "campus1",
    campusName: "Johannesburg Campus",
    yearOfStudy: "year2",
    yearName: "BSc Game Development",
    bio: "Game developer in the making. Working on my first indie game! 🎮✨",
    location: "Johannesburg, South Africa",
    github: "github.com/williamshowdy",
    linkedin: "linkedin.com/in/williams-howdy",
    portfolio: "williamsgames.dev",
    hobbies: ["Gaming", "3D Modeling", "Music production", "Streaming"],
    skills: ["C#", "Unity", "Blender", "Photoshop", "Pixel Art"],
    achievements: [
      "Game Jam Winner 2025",
      "Pixel Art Contest Finalist",
      "Built 5+ mini games",
    ],
    interests: ["Game Design", "VR/AR", "Retro Gaming", "Esports"],
    profileImage: "assets/images/user3.png",
    bannerImage: "https://picsum.photos/id/96/1200/300",
    posts: 12,
  },
  {
    userId: "1779721048476defuvw",
    name: "Mousa",
    surname: "TheGoat",
    username: "MousaTheGoat",
    email: "mousa.goat@example.com",
    studentId: "428367591",
    gender: "male",
    campus: "campus3",
    campusName: "Durban Campus",
    yearOfStudy: "year4",
    yearName: "BSc Computer Science",
    bio: "The GOAT of coding. Full-stack dev, gamer, and content creator. Let's collab! 🐐🔥",
    location: "Durban, South Africa",
    github: "github.com/mousathegoat",
    linkedin: "linkedin.com/in/mousa-thegoat",
    portfolio: "mousathegoat.dev",
    hobbies: ["Football", "Coding challenges", "Content creation", "Anime"],
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Node.js",
      "MongoDB",
    ],
    achievements: [
      "Open Source Contributor of the Year",
      "1000+ GitHub stars",
      "Tech Content Creator (10k+ followers)",
    ],
    interests: ["Web3", "Blockchain", "Streaming", "Tech Reviews"],
    profileImage: "assets/images/user2.png",
    bannerImage: "https://picsum.photos/id/155/1200/300",
    posts: 25,
  },
  {
    userId: "1779721048477ghijkl",
    name: "Veronica",
    surname: "TheGoat",
    username: "VeronicaTheGoat",
    email: "veronica.goat@example.com",
    studentId: "439182746",
    gender: "female",
    campus: "campus2",
    campusName: "Cape Town Campus",
    yearOfStudy: "year1",
    yearName: "BSc Information Systems",
    bio: "Gaming enthusiast and future tech leader. Let's game and grow together! 🎮💪",
    location: "Cape Town, South Africa",
    github: "github.com/veronicathegoat",
    linkedin: "linkedin.com/in/veronica-thegoat",
    portfolio: "",
    hobbies: ["Gaming", "Streaming", "Dance", "Volunteering"],
    skills: [
      "HTML/CSS",
      "JavaScript",
      "UI/UX Basics",
      "Content Creation",
      "Community Management",
    ],
    achievements: [
      "Esports Tournament Winner 2025",
      "Women in Gaming Scholarship",
      "Top Streamer Award",
    ],
    interests: ["Esports", "Game Streaming", "Tech Events", "Mentoring"],
    profileImage: "assets/images/user1.jpeg",
    bannerImage: "https://picsum.photos/id/29/1200/300",
    posts: 8,
  },
  {
    userId: "1779721048474jnlyvq",
    name: "Blessings",
    surname: "Marera",
    username: "blessings",
    email: "marerablessings@gmail.com",
    studentId: "402413918",
    gender: "male",
    campus: "campus2",
    campusName: "Cape Town Campus",
    yearOfStudy: "year3",
    yearName: "BScIT",
    bio: "Passionate about coding and building scalable web apps. Currently exploring React and Node.js. Open to collaborations! 🚀",
    location: "Cape Town, South Africa",
    github: "github.com/blessingsmarera",
    linkedin: "linkedin.com/in/blessings-marera",
    portfolio: "blessingsmarera.dev",
    hobbies: ["Chess", "Hiking", "Reading tech blogs", "Playing guitar"],
    skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "Git"],
    achievements: [
      "Winner - Campus Hackathon 2025",
      "Dean's List 2024",
      "Certified AWS Cloud Practitioner",
    ],
    interests: ["Web Development", "AI", "Open Source", "Cybersecurity"],
    profileImage: "assets/images/user1.jpeg",
    bannerImage: "https://picsum.photos/id/26/1200/300",
    posts: 15,
  },
];

// ========== GLOBAL VARIABLES ==========
let currentUser = users[3]; // Blessings as logged in user
let viewingUserId = null;
let followRelationships = {};

// ========== INITIALIZE FOLLOW RELATIONSHIPS ==========
function initFollows() {
  users.forEach((user) => {
    followRelationships[user.userId] = { followers: [], following: [] };
  });

  // Sample follows
  followRelationships[users[0].userId].following.push(users[3].userId);
  followRelationships[users[3].userId].followers.push(users[0].userId);

  followRelationships[users[1].userId].following.push(users[3].userId);
  followRelationships[users[3].userId].followers.push(users[1].userId);

  followRelationships[users[2].userId].following.push(users[3].userId);
  followRelationships[users[3].userId].followers.push(users[2].userId);
}
initFollows();

// ========== HELPER FUNCTIONS ==========
function getUserById(userId) {
  return users.find((user) => user.userId === userId);
}

function getUserByUsername(username) {
  const cleanUsername = username.replace("@", "").toLowerCase();
  return users.find((user) => user.username.toLowerCase() === cleanUsername);
}

function getFollowersCount(userId) {
  return followRelationships[userId]?.followers.length || 0;
}

function getFollowingCount(userId) {
  return followRelationships[userId]?.following.length || 0;
}

function isFollowing(currentUserId, targetUserId) {
  return (
    followRelationships[currentUserId]?.following.includes(targetUserId) ||
    false
  );
}

function followUser(currentUserId, targetUserId) {
  if (!followRelationships[currentUserId].following.includes(targetUserId)) {
    followRelationships[currentUserId].following.push(targetUserId);
    followRelationships[targetUserId].followers.push(currentUserId);
    return true;
  }
  return false;
}

function unfollowUser(currentUserId, targetUserId) {
  const index =
    followRelationships[currentUserId].following.indexOf(targetUserId);
  if (index > -1) {
    followRelationships[currentUserId].following.splice(index, 1);
    const followerIndex =
      followRelationships[targetUserId].followers.indexOf(currentUserId);
    if (followerIndex > -1) {
      followRelationships[targetUserId].followers.splice(followerIndex, 1);
    }
    return true;
  }
  return false;
}

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// ========== RENDER PROFILE PAGE ==========
function renderProfile(userId) {
  const user = getUserById(userId);
  if (!user) return;

  viewingUserId = userId;

  // Header Section
  document.getElementById("displayName").textContent =
    `${user.name} ${user.surname}`;
  document.getElementById("displayUsername").textContent = `@${user.username}`;
  document.getElementById("displayBio").textContent =
    user.bio || "No bio added yet";
  document.getElementById("displayLocation").innerHTML =
    `📍 ${user.location || "Location not set"}`;
  document.getElementById("displayCourse").innerHTML =
    `🎓 ${user.yearName || "Course not set"}`;
  document.getElementById("displayYear").innerHTML =
    `📚 ${user.yearOfStudy || "Year not set"}`;

  // Images with fallback
  const avatarImg = document.getElementById("avatarImg");
  const bannerImg = document.getElementById("bannerImg");

  avatarImg.src = user.profileImage;
  avatarImg.onerror = () => {
    avatarImg.src = `https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=1e90ff&color=fff&size=128`;
  };

  bannerImg.src = user.bannerImage;
  bannerImg.onerror = () => {
    bannerImg.src = "https://picsum.photos/id/26/1200/300";
  };

  // Stats
  document.getElementById("followersCount").textContent = getFollowersCount(
    user.userId,
  );
  document.getElementById("followingCount").textContent = getFollowingCount(
    user.userId,
  );
  document.getElementById("postsCount").textContent = user.posts || 0;

  // Overview Tab: Personal Info
  document.getElementById("fullName").textContent =
    `${user.name} ${user.surname}`;
  document.getElementById("email").textContent = user.email;
  document.getElementById("studentId").textContent = user.studentId;
  document.getElementById("gender").textContent =
    user.gender || "Not specified";
  document.getElementById("location").textContent =
    user.location || "Not specified";
  document.getElementById("campus").textContent =
    user.campusName || "Richfield";
  document.getElementById("course").textContent =
    user.yearName || "Not specified";
  document.getElementById("year").textContent =
    user.yearOfStudy || "Not specified";

  // Social Links
  const githubLink = document.getElementById("github");
  const linkedinLink = document.getElementById("linkedin");
  const portfolioLink = document.getElementById("portfolio");

  if (user.github) {
    githubLink.href = `https://${user.github}`;
    githubLink.textContent = user.github;
    githubLink.style.color = "#58a6ff";
  } else {
    githubLink.textContent = "Not added";
    githubLink.href = "#";
    githubLink.style.color = "#8b949e";
  }

  if (user.linkedin) {
    linkedinLink.href = `https://${user.linkedin}`;
    linkedinLink.textContent = user.linkedin;
    linkedinLink.style.color = "#58a6ff";
  } else {
    linkedinLink.textContent = "Not added";
    linkedinLink.href = "#";
    linkedinLink.style.color = "#8b949e";
  }

  if (user.portfolio) {
    portfolioLink.href = `https://${user.portfolio}`;
    portfolioLink.textContent = user.portfolio;
    portfolioLink.style.color = "#58a6ff";
  } else {
    portfolioLink.textContent = "Not added";
    portfolioLink.href = "#";
    portfolioLink.style.color = "#8b949e";
  }

  // Hobbies
  const hobbiesList = document.getElementById("hobbiesList");
  hobbiesList.innerHTML =
    user.hobbies?.length > 0
      ? user.hobbies.map((h) => `<li>🎯 ${h}</li>`).join("")
      : "<li>No hobbies added</li>";

  // Skills
  const skillsList = document.getElementById("skillsList");
  skillsList.innerHTML =
    user.skills?.length > 0
      ? user.skills.map((s) => `<li>💻 ${s}</li>`).join("")
      : "<li>No skills added</li>";

  // Interests
  const interestsList = document.getElementById("interestsList");
  interestsList.innerHTML =
    user.interests?.length > 0
      ? user.interests.map((i) => `<li>⭐ ${i}</li>`).join("")
      : "<li>No interests added</li>";

  // Achievements
  const achievementsList = document.getElementById("achievementsList");
  achievementsList.innerHTML =
    user.achievements?.length > 0
      ? user.achievements.map((a) => `<li>🏆 ${a}</li>`).join("")
      : "<li>No achievements yet</li>";

  // Followers & Following Lists
  const followers = followRelationships[user.userId]?.followers || [];
  const following = followRelationships[user.userId]?.following || [];

  const followersList = document.getElementById("followersList");
  const followingList = document.getElementById("followingList");

  followersList.innerHTML =
    followers.length > 0
      ? followers
          .map((fid) => {
            const fUser = getUserById(fid);
            if (!fUser) return "";
            return `
          <div class="connection-item" onclick="viewProfile('${fid}')">
            <img src="${fUser.profileImage}" alt="${fUser.name}" 
                 onerror="this.src='https://ui-avatars.com/api/?name=${fUser.name}+${fUser.surname}&background=1e90ff&color=fff&size=40'">
            <div>
              <h4>${fUser.name} ${fUser.surname}</h4>
              <p>@${fUser.username}</p>
            </div>
          </div>
        `;
          })
          .join("")
      : '<p style="color:#8b949e; text-align:center; padding:20px;">No followers yet</p>';

  followingList.innerHTML =
    following.length > 0
      ? following
          .map((fid) => {
            const fUser = getUserById(fid);
            if (!fUser) return "";
            return `
          <div class="connection-item" onclick="viewProfile('${fid}')">
            <img src="${fUser.profileImage}" alt="${fUser.name}" 
                 onerror="this.src='https://ui-avatars.com/api/?name=${fUser.name}+${fUser.surname}&background=1e90ff&color=fff&size=40'">
            <div>
              <h4>${fUser.name} ${fUser.surname}</h4>
              <p>@${fUser.username}</p>
            </div>
          </div>
        `;
          })
          .join("")
      : '<p style="color:#8b949e; text-align:center; padding:20px;">Not following anyone yet</p>';

  // Update follow button
  updateFollowButton();
}

// ========== UPDATE FOLLOW BUTTON ==========
function updateFollowButton() {
  const followBtn = document.getElementById("followBtn");
  if (!followBtn || !viewingUserId) return;

  const isViewingSelf = currentUser.userId === viewingUserId;

  if (isViewingSelf) {
    followBtn.style.display = "none";
    return;
  }

  followBtn.style.display = "block";
  const following = isFollowing(currentUser.userId, viewingUserId);

  if (following) {
    followBtn.textContent = "Following ✓";
    followBtn.classList.add("following");
  } else {
    followBtn.textContent = "Follow +";
    followBtn.classList.remove("following");
  }
}

// ========== FOLLOW/UNFOLLOW HANDLER ==========
function toggleFollow() {
  if (!viewingUserId || currentUser.userId === viewingUserId) return;

  const isCurrentlyFollowing = isFollowing(currentUser.userId, viewingUserId);

  if (isCurrentlyFollowing) {
    unfollowUser(currentUser.userId, viewingUserId);
    showNotification(`Unfollowed @${getUserById(viewingUserId).username}`);
  } else {
    followUser(currentUser.userId, viewingUserId);
    showNotification(`Following @${getUserById(viewingUserId).username}`);
  }

  renderProfile(viewingUserId);
  renderSuggestions();
}

// ========== NOTIFICATION ==========
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #238636;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 1000;
    animation: fadeInOut 2s ease;
    font-family: 'Poppins', sans-serif;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

// ========== SUGGESTIONS ==========
function renderSuggestions() {
  const suggestionsList = document.getElementById("suggestionsList");
  if (!suggestionsList) return;

  const suggestions = users
    .filter(
      (u) =>
        u.userId !== currentUser.userId &&
        !isFollowing(currentUser.userId, u.userId),
    )
    .slice(0, 3);

  suggestionsList.innerHTML =
    suggestions.length > 0
      ? suggestions
          .map(
            (user) => `
        <div class="suggestion-item" onclick="viewProfile('${user.userId}')">
          <img src="${user.profileImage}" alt="${user.name}" 
               onerror="this.src='https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=1e90ff&color=fff&size=45'">
          <div class="suggestion-info">
            <h4>${user.name} ${user.surname}</h4>
            <p>@${user.username}</p>
          </div>
          <button class="suggestion-follow" onclick="event.stopPropagation(); quickFollow('${user.userId}')">Follow</button>
        </div>
      `,
          )
          .join("")
      : '<p style="color:#8b949e; text-align:center; padding:20px;">No suggestions available</p>';
}

function quickFollow(userId) {
  if (!isFollowing(currentUser.userId, userId)) {
    followUser(currentUser.userId, userId);
    showNotification(`Following @${getUserById(userId).username}`);
    renderSuggestions();

    if (viewingUserId === userId) {
      renderProfile(userId);
    }
  }
}

// ========== VIEW PROFILE (called from feed clicks) ==========
function viewProfile(userIdOrUsername) {
  // Check if it's a userId or username
  let user = getUserById(userIdOrUsername);

  if (!user) {
    user = getUserByUsername(userIdOrUsername);
  }

  if (user) {
    window.location.href = `users_profile.html?userId=${user.userId}`;
  } else {
    console.log("User not found:", userIdOrUsername);
    showNotification("User not found", "error");
  }
}

// ========== TAB SWITCHING ==========
function setupTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  const tabsMap = {
    overview: "overviewTab",
    skills: "skillsTab",
    connections: "connectionsTab",
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(tabsMap[tabId]).classList.add("active");
    });
  });
}

// ========== THEME TOGGLE ==========
function setupTheme() {
  const themeBtn = document.getElementById("themeToggle");
  let isDark = true;

  themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    document.body.style.background = isDark ? "#0d1117" : "#f6f8fa";
    document.body.style.color = isDark ? "#f0f6fc" : "#1f2328";
    themeBtn.textContent = isDark ? "🌙" : "☀️";

    const cards = document.querySelectorAll(
      ".suggestions-card, .quick-links-card, .profile-content, .info-card",
    );
    cards.forEach((card) => {
      if (card) {
        card.style.background = isDark ? "#161b22" : "#ffffff";
        card.style.borderColor = isDark ? "#30363d" : "#d0d7de";
      }
    });
  });
}

// ========== ADD NOTIFICATION STYLES ==========
function addNotificationStyle() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(20px); }
      15% { opacity: 1; transform: translateY(0); }
      85% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
}

// ========== INITIALIZE PAGE ==========
function init() {
  addNotificationStyle();

  // Check for userId parameter first, then username
  let userId = getUrlParameter("userId");
  let username = getUrlParameter("username");

  let targetUser;

  if (userId) {
    targetUser = getUserById(userId);
  } else if (username) {
    targetUser = getUserByUsername(username);
  }

  const targetUserId = targetUser ? targetUser.userId : currentUser.userId;

  renderProfile(targetUserId);
  renderSuggestions();
  setupTabs();
  setupTheme();

  const followBtn = document.getElementById("followBtn");
  if (followBtn) followBtn.addEventListener("click", toggleFollow);

  const currentUserLink = document.getElementById("currentUserLink");
  if (currentUserLink) {
    currentUserLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `users_profile.html?userId=${currentUser.userId}`;
    });
  }
}

// ========== MAKE FUNCTIONS GLOBAL ==========
window.viewProfile = viewProfile;
window.quickFollow = quickFollow;
window.toggleFollow = toggleFollow;

// ========== START APP ==========
init();
