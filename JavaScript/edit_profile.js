// This code handles the Edit Profile page - users can update their info
$(document).ready(function () {
  // ========================================
  // 1. VARIABLES TO STORE USER DATA
  // ========================================
  let currentUser = null; // The logged in user
  let userInterests = []; // List of interests
  let userHobbies = []; // List of hobbies
  let userSkills = []; // List of skills
  let userGoals = []; // List of goals
  let userAchievements = []; // List of achievements

  // ========================================
  // 2. GET THE LOGGED IN USER
  // ========================================
  function getLoggedInUser() {
    // Get user from browser storage
    currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // If no one is logged in, go to login page
    if (!currentUser) {
      window.location.href = "logIn.html";
      return false;
    }
    return true;
  }

  // ========================================
  // 3. LOAD USER'S SAVED PROFILE DATA
  // ========================================
  function getSavedProfileData() {
    let userEmail = currentUser.email;

    // Get all saved profile pictures
    let allProfilePics =
      JSON.parse(localStorage.getItem("profile_images")) || {};

    // Get all saved interests (hobbies, skills, etc.)
    let allInterestsData =
      JSON.parse(localStorage.getItem("user_interests")) || {};

    // Get all saved bio information
    let allBioData = JSON.parse(localStorage.getItem("user_bio")) || {};

    // Return only THIS user's data
    return {
      pictures: allProfilePics[userEmail] || {},
      interests: allInterestsData[userEmail] || {},
      bioInfo: allBioData[userEmail] || {},
    };
  }

  // ========================================
  // 4. SAVE USER'S PROFILE DATA
  // ========================================
  function saveUserProfileData(pictures, interests, bioInfo) {
    let userEmail = currentUser.email;

    // ----- Save pictures -----
    let allProfilePics =
      JSON.parse(localStorage.getItem("profile_images")) || {};
    allProfilePics[userEmail] = pictures;
    localStorage.setItem("profile_images", JSON.stringify(allProfilePics));

    // ----- Save interests (hobbies, skills, etc.) -----
    let allInterestsData =
      JSON.parse(localStorage.getItem("user_interests")) || {};
    allInterestsData[userEmail] = interests;
    localStorage.setItem("user_interests", JSON.stringify(allInterestsData));

    // ----- Save bio information -----
    let allBioData = JSON.parse(localStorage.getItem("user_bio")) || {};
    allBioData[userEmail] = bioInfo;
    localStorage.setItem("user_bio", JSON.stringify(allBioData));

    // ----- Also update the main user object -----
    currentUser.profileImage = pictures.profileImage;
    currentUser.bannerImage = pictures.bannerImage;
    currentUser.hobbies = interests.hobbies;
    currentUser.skills = interests.skills;
    currentUser.achievements = interests.achievements;
    currentUser.interests = interests.interests;
    currentUser.bio = bioInfo.bio;
    currentUser.location = bioInfo.location;
    currentUser.github = bioInfo.github;
    currentUser.linkedin = bioInfo.linkedin;
    currentUser.phone = bioInfo.phone;

    // Save the updated user
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
    localStorage.setItem("richfieldUser", JSON.stringify(currentUser));
  }

  // ========================================
  // 5. FILL THE FORM WITH USER'S SAVED DATA
  // ========================================
  function fillFormWithUserData() {
    let savedData = getSavedProfileData();
    let userPictures = savedData.pictures;
    let userInterestsData = savedData.interests;
    let userBioInfo = savedData.bioInfo;

    // ----- Basic Information -----
    $("#name").val(currentUser.name || "");
    $("#Surname").val(currentUser.surname || "");
    $("#bio").val(userBioInfo.bio || currentUser.bio || "No bio added yet ✨");
    $("#course").val(currentUser.course || "");
    $("#year").val(currentUser.yearOfStudy || "");
    $("#Location").val(userBioInfo.location || currentUser.location || "");
    $("#campus").val(currentUser.campus || "");
    $("#gender").val(currentUser.gender || "");

    // ----- Contact Information -----
    $("#email").val(currentUser.email || "");
    $("#phone").val(userBioInfo.phone || "");
    $("#github").val(userBioInfo.github || "");
    $("#linkedin").val(userBioInfo.linkedin || "");

    // ----- Load all the lists -----
    userHobbies = userInterestsData.hobbies || [];
    userSkills = userInterestsData.skills || [];
    userGoals = userInterestsData.goals || [];
    userAchievements = userInterestsData.achievements || [];
    userInterests = userInterestsData.interests || [];

    // ----- Show them on the page -----
    showHobbiesOnPage();
    showSkillsOnPage();
    showGoalsOnPage();
    showAchievementsOnPage();
    showInterestsOnPage();

    // ----- Load pictures if they exist -----
    if (userPictures.profileImage) {
      $(".profile_preview img").attr("src", userPictures.profileImage);
    }
    if (userPictures.bannerImage) {
      $(".banner_preview img").attr("src", userPictures.bannerImage);
    }
  }

  // ========================================
  // 6. SHOW LISTS ON THE PAGE (HOBBIES, SKILLS, ETC.)
  // ========================================
  function showHobbiesOnPage() {
    showTagList("#hobbiesContainer", userHobbies, "hobby");
  }

  function showSkillsOnPage() {
    showTagList("#skillsContainer", userSkills, "skill");
  }

  function showGoalsOnPage() {
    showTagList("#goalsContainer", userGoals, "goal");
  }

  function showAchievementsOnPage() {
    showTagList("#achievementsContainer", userAchievements, "achievement");
  }

  function showInterestsOnPage() {
    showTagList("#interestsContainer", userInterests, "interest", true);
  }

  // Helper function to show any list of tags
  function showTagList(containerId, itemsList, tagType, isPreSelected = false) {
    let $container = $(containerId);
    $container.empty(); // Clear old list

    // If list is empty, show a message
    if (itemsList.length === 0) {
      $container.append(
        `<span class="empty-tag">No ${tagType}s added yet</span>`,
      );
    } else {
      // Show each item as a button
      for (let i = 0; i < itemsList.length; i++) {
        let item = itemsList[i];
        let selectedClass = isPreSelected ? "selected" : "";
        let buttonHtml = `<button type="button" class="tag ${selectedClass}" data-type="${tagType}">${makeSafe(item)}</button>`;
        $container.append(buttonHtml);
      }
    }
  }

  // ========================================
  // 7. ADD A NEW ITEM TO A LIST
  // ========================================
  function addNewItem(listType, newValue) {
    if (!newValue.trim()) return; // Don't add empty items

    // Figure out which list to add to
    if (listType === "hobby") {
      if (!userHobbies.includes(newValue)) {
        userHobbies.push(newValue);
        showHobbiesOnPage();
      }
    } else if (listType === "skill") {
      if (!userSkills.includes(newValue)) {
        userSkills.push(newValue);
        showSkillsOnPage();
      }
    } else if (listType === "goal") {
      if (!userGoals.includes(newValue)) {
        userGoals.push(newValue);
        showGoalsOnPage();
      }
    } else if (listType === "achievement") {
      if (!userAchievements.includes(newValue)) {
        userAchievements.push(newValue);
        showAchievementsOnPage();
      }
    } else if (listType === "interest") {
      if (!userInterests.includes(newValue)) {
        userInterests.push(newValue);
        showInterestsOnPage();
      }
    }

    showPopupMessage(listType + " added!");
  }

  // ========================================
  // 8. REMOVE AN ITEM FROM A LIST
  // ========================================
  function removeItemFromList(listType, valueToRemove) {
    if (listType === "hobby") {
      // Keep only items that are NOT the one to remove
      userHobbies = userHobbies.filter(function (item) {
        return item !== valueToRemove;
      });
      showHobbiesOnPage();
    } else if (listType === "skill") {
      userSkills = userSkills.filter(function (item) {
        return item !== valueToRemove;
      });
      showSkillsOnPage();
    } else if (listType === "goal") {
      userGoals = userGoals.filter(function (item) {
        return item !== valueToRemove;
      });
      showGoalsOnPage();
    } else if (listType === "achievement") {
      userAchievements = userAchievements.filter(function (item) {
        return item !== valueToRemove;
      });
      showAchievementsOnPage();
    } else if (listType === "interest") {
      userInterests = userInterests.filter(function (item) {
        return item !== valueToRemove;
      });
      showInterestsOnPage();
    }

    showPopupMessage(listType + " removed");
  }

  // ========================================
  // 9. HANDLE CLICKING ON TAGS (ADD/REMOVE)
  // ========================================
  $(document).on("click", ".tag", function () {
    let $clickedButton = $(this);
    let tagType = $clickedButton.data("type");
    let tagValue = $clickedButton.text();

    // If it's already selected, remove it
    if ($clickedButton.hasClass("selected")) {
      $clickedButton.removeClass("selected");
      removeItemFromList(tagType, tagValue);
    }
    // Otherwise, add it
    else {
      $clickedButton.addClass("selected");
      addNewItem(tagType, tagValue);
    }
  });

  // ========================================
  // 10. HANDLE IMAGE UPLOADS
  // ========================================
  function setupImageUploads() {
    // Profile picture upload
    $("#profileUpload").on("change", function (event) {
      let file = event.target.files[0];

      if (file && file.type.startsWith("image/")) {
        let fileReader = new FileReader();

        fileReader.onload = function (loadEvent) {
          let imageUrl = loadEvent.target.result;
          $(".profile_preview img").attr("src", imageUrl);
          showPopupMessage("Profile image updated!");
        };

        fileReader.readAsDataURL(file);
      }
    });

    // Banner image upload
    $("#bannerUpload").on("change", function (event) {
      let file = event.target.files[0];

      if (file && file.type.startsWith("image/")) {
        let fileReader = new FileReader();

        fileReader.onload = function (loadEvent) {
          let imageUrl = loadEvent.target.result;
          $(".banner_preview img").attr("src", imageUrl);
          showPopupMessage("Banner image updated!");
        };

        fileReader.readAsDataURL(file);
      }
    });
  }

  // ========================================
  // 11. SETUP THE "ADD" BUTTONS
  // ========================================
  function setupAddButtons() {
    // Hobby Add Button
    $("#addHobbyBtn").click(function () {
      let newHobby = $("#hobbyInput").val();
      addNewItem("hobby", newHobby);
      $("#hobbyInput").val(""); // Clear the input
    });

    // Skill Add Button
    $("#addSkillBtn").click(function () {
      let newSkill = $("#skillInput").val();
      addNewItem("skill", newSkill);
      $("#skillInput").val("");
    });

    // Goal Add Button
    $("#addGoalBtn").click(function () {
      let newGoal = $("#goalInput").val();
      addNewItem("goal", newGoal);
      $("#goalInput").val("");
    });

    // Achievement Add Button
    $("#addAchievementBtn").click(function () {
      let newAchievement = $("#achievementInput").val();
      addNewItem("achievement", newAchievement);
      $("#achievementInput").val("");
    });

    // Interest Add Button
    $("#addInterestBtn").click(function () {
      let newInterest = $("#interestInput").val();
      addNewItem("interest", newInterest);
      $("#interestInput").val("");
    });

    // Pressing Enter key also adds the item
    $(".card input[type='text']").on("keypress", function (event) {
      if (event.which === 13) {
        // Enter key
        event.preventDefault();
        $(this).siblings("button").click(); // Click the add button
      }
    });
  }

  // ========================================
  // 12. SHOW A TEMPORARY POPUP MESSAGE
  // ========================================
  function showPopupMessage(message) {
    let popup = $("#popup");
    popup.text("✅ " + message);
    popup.addClass("show");

    // Hide after 2 seconds
    setTimeout(function () {
      popup.removeClass("show");
    }, 2000);
  }

  // ========================================
  // 13. SAVE ALL CHANGES AND GO TO PROFILE
  // ========================================
  function saveAllChangesAndRedirect() {
    // Get the picture URLs
    let userPictures = {
      profileImage: $(".profile_preview img").attr("src"),
      bannerImage: $(".banner_preview img").attr("src"),
    };

    // Get all the lists
    let userInterestsData = {
      hobbies: userHobbies,
      skills: userSkills,
      goals: userGoals,
      achievements: userAchievements,
      interests: userInterests,
    };

    // Get bio information
    let userBioInfo = {
      bio: $("#bio").val().trim() || "No bio added yet ✨",
      location: $("#Location").val(),
      github: $("#github").val().trim(),
      linkedin: $("#linkedin").val().trim(),
      phone: $("#phone").val().trim(),
    };

    // Update basic user info
    currentUser.name = $("#name").val().trim();
    currentUser.surname = $("#Surname").val().trim();
    currentUser.course = $("#course").val().trim();
    currentUser.yearOfStudy = $("#year").val();
    currentUser.campus = $("#campus").val();
    currentUser.gender = $("#gender").val();
    currentUser.email = $("#email").val().trim();

    // Save everything
    saveUserProfileData(userPictures, userInterestsData, userBioInfo);

    // Tell user it worked
    alert("✅ Profile updated successfully!");

    // Go to profile page
    window.location.href = "Profile.html";
  }

  // ========================================
  // 14. MAKE TEXT SAFE (PREVENT HACKING)
  // ========================================
  function makeSafe(text) {
    if (!text) return "";
    let tempDiv = document.createElement("div");
    tempDiv.textContent = text;
    return tempDiv.innerHTML;
  }

  // ========================================
  // 15. START EVERYTHING
  // ========================================
  function initializePage() {
    // Step 1: Make sure user is logged in
    let userLoaded = getLoggedInUser();
    if (!userLoaded) return;

    // Step 2: Fill the form with their data
    fillFormWithUserData();

    // Step 3: Setup image uploads
    setupImageUploads();

    // Step 4: Setup add buttons
    setupAddButtons();

    // Step 5: Handle form submission (save button)
    $("#profileForm").on("submit", function (event) {
      event.preventDefault(); // Stop normal form submit
      saveAllChangesAndRedirect();
    });
  }

  // Run everything
  initializePage();
});
