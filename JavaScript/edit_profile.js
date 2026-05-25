$(document).ready(function () {
  // =========================
  // GLOBAL VARIABLES
  // =========================
  let currentUser = null;
  let database = null;
  let selectedTags = [];
  let hobbies = [];
  let skills = [];
  let goals = [];
  let achievements = [];

  // =========================
  // LOAD CURRENT USER FROM JSON
  // =========================
  async function loadCurrentUser() {
    // First try to get from localStorage
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

    return true;
  }

  // =========================
  // SAVE USER TO DATABASE
  // =========================
  function saveUserToDatabase() {
    if (!database) {
      database = {
        users: [],
        posts: [],
        comments: {},
        postLikes: {},
        commentLikes: {},
        stats: {
          totalPosts: 0,
          totalComments: 0,
          totalPostLikes: 0,
          totalCommentLikes: 0,
        },
      };
    }

    if (!database.users) {
      database.users = [];
    }

    // Find and update user
    const userIndex = database.users.findIndex(
      (u) => u.email === currentUser.email,
    );
    if (userIndex !== -1) {
      database.users[userIndex] = currentUser;
    } else {
      database.users.push(currentUser);
    }

    // Save to localStorage
    localStorage.setItem("richfield_database", JSON.stringify(database));
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
    localStorage.setItem("richfieldUser", JSON.stringify(currentUser));

    // Auto-download JSON file
    downloadJSONFile(database, "richfield_database.json");
  }

  // =========================
  // DOWNLOAD JSON FILE
  // =========================
  function downloadJSONFile(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`${filename} downloaded!`);
  }

  // =========================
  // POPULATE FORM WITH USER DATA
  // =========================
  function populateForm() {
    // Basic Information
    $("#name").val(currentUser.name || "");
    $("#Surname").val(currentUser.surname || "");
    $("#bio").val(currentUser.bio || "No bio added yet ✨");
    $("#course").val(currentUser.course || currentUser.yearName || "");
    $("#year").val(currentUser.yearOfStudy || "");
    $("#Location").val(currentUser.location || "");
    $("#campus").val(currentUser.campus || "");
    $("#gender").val(currentUser.gender || "");

    // Contact Information
    $("#email").val(currentUser.email || "");
    $("#phone").val(currentUser.phone || "");
    $("#github").val(currentUser.github || "");
    $("#linkedin").val(currentUser.linkedin || "");

    // Load arrays
    hobbies = currentUser.hobbies || [];
    skills = currentUser.skills || [];
    goals = currentUser.achievements || [];
    achievements = currentUser.achievements || [];
    selectedTags = currentUser.interests || [];

    // Render tags
    renderHobbies();
    renderSkills();
    renderGoals();
    renderAchievements();
    renderInterests();

    // Load profile image if exists
    if (currentUser.profileImage) {
      $(".profile_preview img").attr("src", currentUser.profileImage);
    } else {
      $(".profile_preview img").attr("src", "assets/images/default-avatar.png");
    }

    // Load banner image if exists
    if (currentUser.bannerImage) {
      $(".banner_preview img").attr("src", currentUser.bannerImage);
    } else {
      $(".banner_preview img").attr("src", "assets/images/default-banner.jpg");
    }
  }

  // =========================
  // RENDER HOBBIES
  // =========================
  function renderHobbies() {
    const $hobbyContainer = $(".card").eq(4).find(".tags");
    if ($hobbyContainer.length) {
      $hobbyContainer.empty();
      hobbies.forEach((hobby) => {
        $hobbyContainer.append(
          `<button type="button" class="tag" data-type="hobby">${escapeHtml(hobby)}</button>`,
        );
      });
      attachTagEvents();
    }
  }

  // =========================
  // RENDER SKILLS
  // =========================
  function renderSkills() {
    const $skillContainer = $(".card").eq(5).find(".tags");
    if ($skillContainer.length) {
      $skillContainer.empty();
      skills.forEach((skill) => {
        $skillContainer.append(
          `<button type="button" class="tag" data-type="skill">${escapeHtml(skill)}</button>`,
        );
      });
      attachTagEvents();
    }
  }

  // =========================
  // RENDER GOALS
  // =========================
  function renderGoals() {
    const $goalContainer = $(".card").eq(6).find(".tags");
    if ($goalContainer.length) {
      $goalContainer.empty();
      goals.forEach((goal) => {
        $goalContainer.append(
          `<button type="button" class="tag" data-type="goal">${escapeHtml(goal)}</button>`,
        );
      });
      attachTagEvents();
    }
  }

  // =========================
  // RENDER ACHIEVEMENTS
  // =========================
  function renderAchievements() {
    const $achievementContainer = $(".card").eq(7).find(".tags");
    if ($achievementContainer.length) {
      $achievementContainer.empty();
      achievements.forEach((achievement) => {
        $achievementContainer.append(
          `<button type="button" class="tag" data-type="achievement">${escapeHtml(achievement)}</button>`,
        );
      });
      attachTagEvents();
    }
  }

  // =========================
  // RENDER INTERESTS
  // =========================
  function renderInterests() {
    const $interestContainer = $(".card").eq(3).find(".tags");
    if ($interestContainer.length) {
      $interestContainer.empty();
      selectedTags.forEach((interest) => {
        $interestContainer.append(
          `<button type="button" class="tag selected" data-type="interest">${escapeHtml(interest)}</button>`,
        );
      });
      attachTagEvents();
    }
  }

  // =========================
  // ADD ITEM TO ARRAY
  // =========================
  function addItemToArray(type, value) {
    if (!value.trim()) return;

    switch (type) {
      case "hobby":
        if (!hobbies.includes(value)) {
          hobbies.push(value);
          renderHobbies();
        }
        break;
      case "skill":
        if (!skills.includes(value)) {
          skills.push(value);
          renderSkills();
        }
        break;
      case "goal":
        if (!goals.includes(value)) {
          goals.push(value);
          renderGoals();
        }
        break;
      case "achievement":
        if (!achievements.includes(value)) {
          achievements.push(value);
          renderAchievements();
        }
        break;
      case "interest":
        if (!selectedTags.includes(value)) {
          selectedTags.push(value);
          renderInterests();
        }
        break;
    }
  }

  // =========================
  // REMOVE ITEM FROM ARRAY
  // =========================
  function removeItemFromArray(type, value) {
    switch (type) {
      case "hobby":
        hobbies = hobbies.filter((h) => h !== value);
        renderHobbies();
        break;
      case "skill":
        skills = skills.filter((s) => s !== value);
        renderSkills();
        break;
      case "goal":
        goals = goals.filter((g) => g !== value);
        renderGoals();
        break;
      case "achievement":
        achievements = achievements.filter((a) => a !== value);
        renderAchievements();
        break;
      case "interest":
        selectedTags = selectedTags.filter((i) => i !== value);
        renderInterests();
        break;
    }
  }

  // =========================
  // ATTACH TAG EVENTS
  // =========================
  function attachTagEvents() {
    $(".tag")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        const $this = $(this);
        const type = $this.data("type");
        const value = $this.text();

        if ($this.hasClass("selected")) {
          $this.removeClass("selected");
          removeItemFromArray(type, value);
        } else {
          $this.addClass("selected");
          addItemToArray(type, value);
        }
      });
  }

  // =========================
  // IMAGE UPLOAD HANDLERS
  // =========================
  function setupImageUploads() {
    // Profile image upload
    $("#profileUpload")
      .off("change")
      .on("change", function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const imageUrl = event.target.result;
            $(".profile_preview img").attr("src", imageUrl);
            currentUser.profileImage = imageUrl;
            saveUserToDatabase();
            showPopup("Profile image updated! 📸");
          };
          reader.readAsDataURL(file);
        } else {
          showPopup("Please select a valid image!", "error");
        }
      });

    // Banner image upload
    $("#bannerUpload")
      .off("change")
      .on("change", function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const imageUrl = event.target.result;
            $(".banner_preview img").attr("src", imageUrl);
            currentUser.bannerImage = imageUrl;
            saveUserToDatabase();
            showPopup("Banner image updated! 🖼️");
          };
          reader.readAsDataURL(file);
        } else {
          showPopup("Please select a valid image!", "error");
        }
      });
  }

  // =========================
  // SETUP ADD BUTTONS
  // =========================
  function setupAddButtons() {
    // Hobbies add button
    $(".card")
      .eq(4)
      .find("button")
      .not(".tag")
      .off("click")
      .on("click", function () {
        const input = $(this).siblings("input").first();
        const value = input.val();
        if (value.trim()) {
          addItemToArray("hobby", value);
          input.val("");
        }
      });

    // Skills add button
    $(".card")
      .eq(5)
      .find("button")
      .not(".tag")
      .off("click")
      .on("click", function () {
        const input = $(this).siblings("input").first();
        const value = input.val();
        if (value.trim()) {
          addItemToArray("skill", value);
          input.val("");
        }
      });

    // Goals add button
    $(".card")
      .eq(6)
      .find("button")
      .not(".tag")
      .off("click")
      .on("click", function () {
        const input = $(this).siblings("input").first();
        const value = input.val();
        if (value.trim()) {
          addItemToArray("goal", value);
          input.val("");
        }
      });

    // Achievements add button
    $(".card")
      .eq(7)
      .find("button")
      .not(".tag")
      .off("click")
      .on("click", function () {
        const input = $(this).siblings("input").first();
        const value = input.val();
        if (value.trim()) {
          addItemToArray("achievement", value);
          input.val("");
        }
      });

    // Interests add button
    $(".card")
      .eq(3)
      .find("button")
      .not(".tag")
      .off("click")
      .on("click", function () {
        const input = $(this).siblings("input").first();
        const value = input.val();
        if (value.trim()) {
          addItemToArray("interest", value);
          input.val("");
        }
      });

    // Enter key support for inputs
    $(".card input[type='text']")
      .off("keypress")
      .on("keypress", function (e) {
        if (e.which === 13) {
          e.preventDefault();
          const $button = $(this).siblings("button").first();
          $button.click();
        }
      });
  }

  // =========================
  // SHOW POPUP NOTIFICATION
  // =========================
  function showPopup(message, type = "success") {
    const popup = $("#popup");
    popup.text(type === "success" ? `✅ ${message}` : `❌ ${message}`);
    popup.css(
      "background",
      type === "success"
        ? "linear-gradient(135deg, #0052cc, #1e90ff)"
        : "#f44336",
    );
    popup.addClass("show");
    setTimeout(() => {
      popup.removeClass("show");
    }, 3000);
  }

  // =========================
  // SAVE ALL CHANGES
  // =========================
  function saveAllChanges() {
    // Update basic info
    currentUser.name = $("#name").val().trim();
    currentUser.surname = $("#Surname").val().trim();
    currentUser.bio = $("#bio").val().trim() || "No bio added yet ✨";
    currentUser.course = $("#course").val().trim();
    currentUser.yearOfStudy = $("#year").val();
    currentUser.location = $("#Location").val();
    currentUser.campus = $("#campus").val();
    currentUser.campusName = $("#campus option:selected").text();
    currentUser.gender = $("#gender").val();

    // Update contact info
    currentUser.email = $("#email").val().trim();
    currentUser.phone = $("#phone").val().trim();
    currentUser.github = $("#github").val().trim();
    currentUser.linkedin = $("#linkedin").val().trim();

    // Update arrays
    currentUser.hobbies = hobbies;
    currentUser.skills = skills;
    currentUser.achievements = achievements;
    currentUser.interests = selectedTags;

    // Save to database
    saveUserToDatabase();

    showPopup("Profile updated successfully!");

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = "Profile.html";
    }, 1000);
  }

  // =========================
  // HELPER: ESCAPE HTML
  // =========================
  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // =========================
  // INITIALIZE EVERYTHING
  // =========================
  async function init() {
    const loaded = await loadCurrentUser();
    if (!loaded) return;

    populateForm();
    setupImageUploads();
    setupAddButtons();
    attachTagEvents();

    // Handle form submission
    $("#profileForm")
      .off("submit")
      .on("submit", function (e) {
        e.preventDefault();
        saveAllChanges();
      });
  }

  // Start the app
  init();
});
