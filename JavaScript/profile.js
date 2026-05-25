// This code loads and displays the user's profile page
$(document).ready(function () {
  // ========================================
  // 1. WHO IS LOGGED IN?
  // ========================================
  let currentUser = null;

  function getLoggedInUser() {
    // Get user data from browser storage
    currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // If no one is logged in, send them to login page
    if (!currentUser) {
      window.location.href = "logIn.html";
      return false;
    }
    return true;
  }

  // ========================================
  // 2. GET ALL PROFILE DATA FROM STORAGE
  // ========================================
  function getUserProfileData() {
    const userEmail = currentUser.email;

    // Get profile pictures (or empty object if none exist)
    let allProfileImages =
      JSON.parse(localStorage.getItem("profile_images")) || {};

    // Get user interests (hobbies, skills, etc.)
    let allUserInterests =
      JSON.parse(localStorage.getItem("user_interests")) || {};

    // Get user bio information
    let allUserBios = JSON.parse(localStorage.getItem("user_bio")) || {};

    // Return only THIS user's data
    return {
      images: allProfileImages[userEmail] || {},
      interests: allUserInterests[userEmail] || {},
      bio: allUserBios[userEmail] || {},
    };
  }

  // ========================================
  // 3. DISPLAY EVERYTHING ON THE PAGE
  // ========================================
  function showProfileOnPage() {
    // Get the user's data
    let userData = getUserProfileData();
    let userImages = userData.images;
    let userInterests = userData.interests;
    let userBio = userData.bio;

    // ----- TOP SECTION (Hero) -----
    let fullName =
      (currentUser.name || "Add your name") + " " + (currentUser.surname || "");
    $("#profileName").text(fullName);

    $("#profileUsername").text(currentUser.username || "@username");
    $("#profileCourse").text(currentUser.course || "Add course");
    $("#profileYear").text(currentUser.yearOfStudy || "Add year");
    $("#profileBio").text(userBio.bio || currentUser.bio || "Add bio");

    // ----- PICTURES -----
    let profilePic =
      userImages.profileImage || "assets/images/defaultProfile.png";
    let bannerPic = userImages.bannerImage || "assets/images/defaultBanner.jpg";
    $("#profileImage").attr("src", profilePic);
    $("#bannerImage").attr("src", bannerPic);

    // ----- PERSONAL INFO -----
    $("#overviewName").text(currentUser.name || "Not set");
    $("#overviewSurname").text(currentUser.surname || "Not set");
    $("#overviewStudentID").text(currentUser.studentId || "Not set");
    $("#overviewEmail").text(currentUser.email || "Not set");
    $("#overviewGender").text(currentUser.gender || "Not set");

    let userLocation = userBio.location || currentUser.location || "Not set";
    $("#overviewLocation").text(userLocation);

    // ----- SOCIAL LINKS -----
    if (userBio.github) {
      $("#githubLink").attr("href", userBio.github).text("GitHub Profile");
    }
    if (userBio.linkedin) {
      $("#linkedinLink")
        .attr("href", userBio.linkedin)
        .text("LinkedIn Profile");
    }

    // ----- EDUCATION -----
    let campusName =
      currentUser.campusName || currentUser.campus || "Richfield";
    $("#overviewCampus").text(campusName);

    let yearName =
      currentUser.yearName || currentUser.yearOfStudy || "Not specified";
    $("#overviewYear").text(yearName);

    $("#overviewCourse").text(currentUser.course || "Not specified");

    // ----- HOBBIES -----
    let hobbyList = userInterests.hobbies || [];
    let $hobbyContainer = $("#hobbiesList");
    $hobbyContainer.empty();

    if (hobbyList.length > 0) {
      // Show each hobby
      for (let i = 0; i < hobbyList.length; i++) {
        let hobby = hobbyList[i];
        let html = `<li>
          <span class="material-symbols-rounded">sports_esports</span>
          <div><h4>${makeSafe(hobby)}</h4></div>
        </li>`;
        $hobbyContainer.append(html);
      }
    } else {
      // Show empty message
      $hobbyContainer.html(`<li>
        <span class="material-symbols-rounded">sports_esports</span>
        <div><p>No hobbies added yet</p></div>
      </li>`);
    }

    // ----- INTERESTS -----
    let interestList = userInterests.interests || [];
    let $interestContainer = $("#interestsList");
    $interestContainer.empty();

    if (interestList.length > 0) {
      for (let i = 0; i < interestList.length; i++) {
        let interest = interestList[i];
        let html = `<li>
          <span class="material-symbols-rounded">favorite</span>
          <div><h4>${makeSafe(interest)}</h4></div>
        </li>`;
        $interestContainer.append(html);
      }
    } else {
      $interestContainer.html(`<li>
        <span class="material-symbols-rounded">favorite</span>
        <div><p>No interests added yet</p></div>
      </li>`);
    }

    // ----- SKILLS -----
    let skillList = userInterests.skills || [];
    let $skillsContainer = $("#skillsList");
    $skillsContainer.empty();

    if (skillList.length > 0) {
      for (let i = 0; i < skillList.length; i++) {
        let skill = skillList[i];
        let html = `<li>
          <span class="material-symbols-rounded">code</span>
          <div><h4>${makeSafe(skill)}</h4></div>
        </li>`;
        $skillsContainer.append(html);
      }
    } else {
      $skillsContainer.html(`<li>
        <span class="material-symbols-rounded">code</span>
        <div><p>No skills added yet</p></div>
      </li>`);
    }

    // ----- GOALS -----
    let goalList = userInterests.goals || [];
    let $goalsContainer = $("#goalsList");
    $goalsContainer.empty();

    if (goalList.length > 0) {
      for (let i = 0; i < goalList.length; i++) {
        let goal = goalList[i];
        let html = `<li>
          <span class="material-symbols-rounded">flag</span>
          <div><h4>${makeSafe(goal)}</h4></div>
        </li>`;
        $goalsContainer.append(html);
      }
    } else {
      $goalsContainer.html(`<li>
        <span class="material-symbols-rounded">flag</span>
        <div><p>No goals added yet</p></div>
      </li>`);
    }

    // ----- ACHIEVEMENTS -----
    let achievementList = userInterests.achievements || [];
    let $achievementsContainer = $("#achievementsList");
    $achievementsContainer.empty();

    if (achievementList.length > 0) {
      for (let i = 0; i < achievementList.length; i++) {
        let achievement = achievementList[i];
        let html = `<li>
          <span class="material-symbols-rounded">emoji_events</span>
          <div><h4>${makeSafe(achievement)}</h4></div>
        </li>`;
        $achievementsContainer.append(html);
      }
    } else {
      $achievementsContainer.html(`<li>
        <span class="material-symbols-rounded">emoji_events</span>
        <div><p>No achievements added yet</p></div>
      </li>`);
    }

    // ----- POST COUNT -----
    let allFeedPosts = JSON.parse(localStorage.getItem("feed_posts")) || [];
    let myPosts = [];

    // Find all posts made by this user
    for (let i = 0; i < allFeedPosts.length; i++) {
      if (allFeedPosts[i].username === currentUser.username) {
        myPosts.push(allFeedPosts[i]);
      }
    }
    $("#postsCount").text(myPosts.length);

    // ----- PROFILE COMPLETION PERCENTAGE -----
    calculateProfileCompletion(userImages, userInterests, userBio);
  }

  // ========================================
  // 4. CALCULATE HOW COMPLETE THE PROFILE IS
  // ========================================
  function calculateProfileCompletion(images, interests, bio) {
    // List of things that make a complete profile
    let checklist = [
      currentUser.name,
      currentUser.surname,
      currentUser.email,
      bio.bio && bio.bio !== "No bio added yet ✨",
      bio.location,
      bio.github,
      bio.linkedin,
      images.profileImage,
      interests.interests && interests.interests.length > 0,
      interests.hobbies && interests.hobbies.length > 0,
      interests.skills && interests.skills.length > 0,
      interests.goals && interests.goals.length > 0,
      interests.achievements && interests.achievements.length > 0,
    ];

    // Count how many are complete
    let completedCount = 0;
    for (let i = 0; i < checklist.length; i++) {
      if (checklist[i]) {
        completedCount++;
      }
    }

    // Calculate percentage
    let percentage = Math.floor((completedCount / checklist.length) * 100);

    // Update the progress bar
    $("#completionPercent").text(percentage + "%");
    $("#completionFill").css("width", percentage + "%");
  }

  // ========================================
  // 5. DARK/LIGHT MODE BUTTON
  // ========================================
  function setupDarkLightMode() {
    let themeButton = $("#themeToggle");

    // Check if user prefers dark or light mode
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      $("body").addClass("light_mode");
    }

    // When button is clicked, switch mode
    themeButton.click(function () {
      $("body").toggleClass("light_mode");

      let newTheme = $("body").hasClass("light_mode") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
    });
  }

  // ========================================
  // 6. SAFELY DISPLAY TEXT (PREVENT HACKING)
  // ========================================
  function makeSafe(text) {
    if (!text) return "";
    // This converts special characters to safe HTML entities
    let tempDiv = document.createElement("div");
    tempDiv.textContent = text;
    return tempDiv.innerHTML;
  }

  // ========================================
  // 7. START EVERYTHING
  // ========================================
  function startPage() {
    // Step 1: Make sure someone is logged in
    let userLoaded = getLoggedInUser();
    if (!userLoaded) return;

    // Step 2: Show all their profile data
    showProfileOnPage();

    // Step 3: Setup dark/light mode button
    setupDarkLightMode();
  }
  // ========================================
  // 8. DISPLAY USER STATS (Posts, Likes, Comments)
  // ========================================
  function displayUserStats() {
    let userEmail = currentUser.email;
    let statsKey = "user_stats_" + userEmail;
    let userStats = JSON.parse(localStorage.getItem(statsKey));

    if (userStats) {
      // Update the activity cards with stats
      $("#post_count").text(userStats.postCount || 0);
      $("#liked_post").text(userStats.likeCount || 0);
      $("#comment_count").text(userStats.commentCount || 0);

      console.log("📊 Profile Stats Loaded:");
      console.log("   - Posts created: " + (userStats.postCount || 0));
      console.log("   - Likes received: " + (userStats.likeCount || 0));
      console.log("   - Comments received: " + (userStats.commentCount || 0));
    } else {
      // No stats yet, show zeros
      $("#post_count").text("0");
      $("#liked_post").text("0");
      $("#comment_count").text("0");
      console.log("📊 No stats found for user yet");
    }
  }

  // Also add this to show the actual posts the user made
  function displayUserPosts() {
    let allFeedPosts = JSON.parse(localStorage.getItem("feed_posts")) || [];
    let myPosts = [];
    let userEmail = currentUser.email;
    let userName = currentUser.username;

    // Find all posts made by this user
    for (let i = 0; i < allFeedPosts.length; i++) {
      let post = allFeedPosts[i];
      // Check by username or userId
      if (post.username === userName || post.userId === userEmail) {
        myPosts.push(post);
      }
    }

    let postsContainer = $("#userPostsList");
    if (postsContainer.length) {
      postsContainer.empty();

      if (myPosts.length === 0) {
        postsContainer.html(
          '<li class="no-data">No posts yet. Create your first post on the Feed page! 📝</li>',
        );
      } else {
        // Show the 5 most recent posts
        let postsToShow = myPosts.slice(0, 5);
        for (let i = 0; i < postsToShow.length; i++) {
          let post = postsToShow[i];
          let timeAgo = getTimeAgo(post.time);
          postsContainer.append(`
          <li class="post-item">
            <div class="post-title">📌 ${makeSafe(post.topic)}</div>
            <div class="post-preview">${makeSafe(post.content.substring(0, 80))}${post.content.length > 80 ? "..." : ""}</div>
            <div class="post-meta">
              <span>❤️ ${post.likes || 0} likes</span>
              <span>💬 ${post.comments ? post.comments.length : 0} comments</span>
              <span>🕐 ${timeAgo}</span>
            </div>
          </li>
        `);
        }

        if (myPosts.length > 5) {
          postsContainer.append(
            '<li class="view-more"><a href="Feed.html">View all ' +
              myPosts.length +
              " posts →</a></li>",
          );
        }
      }
    }
  }

  // Helper function to get time ago (add to your profile.js)
  function getTimeAgo(timestamp) {
    if (!timestamp) return "recently";
    let seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 10) return "just now";
    if (seconds < 60) return seconds + " seconds ago";
    let minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
    let hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
    let days = Math.floor(hours / 24);
    if (days < 7) return days + " day" + (days > 1 ? "s" : "") + " ago";
    return new Date(timestamp).toLocaleDateString();
  }

  // Run the page
  startPage();
});
