$(document).ready(function () {
  console.log("✅ Edit Profile loaded");

  // ======================================
  // 1. CURRENT USER
  // ======================================

  let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!currentUser) {
    window.location.href = "logIn.html";
    return;
  }

  // ======================================
  // 2. PROFILE DATA (LOCAL STATE)
  // ======================================

  let hobbies = [];
  let skills = [];
  let goals = [];
  let achievements = [];
  let interests = [];

  // ======================================
  // 3. LOAD USER DATA FROM STORAGE
  // ======================================

  function loadUserData() {
    const email = currentUser.email;

    const images = JSON.parse(localStorage.getItem("profile_images")) || {};

    const interestData =
      JSON.parse(localStorage.getItem("user_interests")) || {};

    const bioData = JSON.parse(localStorage.getItem("user_bio")) || {};

    return {
      images: images[email] || {},
      interests: interestData[email] || {},
      bio: bioData[email] || {},
    };
  }

  // ======================================
  // 4. FILL FORM
  // ======================================

  function fillForm() {
    const data = loadUserData();

    $("#name").val(currentUser.name || "");
    $("#Surname").val(currentUser.surname || "");
    $("#email").val(currentUser.email || "");

    $("#bio").val(data.bio.bio || "");
    $("#Location").val(data.bio.location || "");

    hobbies = data.interests.hobbies || [];
    skills = data.interests.skills || [];
    goals = data.interests.goals || [];
    achievements = data.interests.achievements || [];
    interests = data.interests.interests || [];

    renderAllLists();

    // images
    if (data.images.profileImage) {
      $(".profile_preview img").attr("src", data.images.profileImage);
    }

    if (data.images.bannerImage) {
      $(".banner_preview img").attr("src", data.images.bannerImage);
    }
  }

  // ======================================
  // 5. RENDER LISTS
  // ======================================

  function renderList(container, list, type) {
    const $box = $(container);
    $box.empty();

    if (list.length === 0) {
      $box.html(`<span>No ${type}s yet</span>`);
      return;
    }

    list.forEach((item) => {
      $box.append(`
        <button class="tag" data-type="${type}">
          ${escapeText(item)}
        </button>
      `);
    });
  }

  function renderAllLists() {
    renderList("#hobbiesContainer", hobbies, "hobby");
    renderList("#skillsContainer", skills, "skill");
    renderList("#goalsContainer", goals, "goal");
    renderList("#achievementsContainer", achievements, "achievement");
    renderList("#interestsContainer", interests, "interest");
  }

  // ======================================
  // 6. ADD ITEM
  // ======================================

  function addItem(type, value) {
    if (!value.trim()) return;

    const map = {
      hobby: hobbies,
      skill: skills,
      goal: goals,
      achievement: achievements,
      interest: interests,
    };

    if (!map[type].includes(value)) {
      map[type].push(value);
      renderAllLists();
    }
  }

  // ======================================
  // 7. REMOVE ITEM
  // ======================================

  function removeItem(type, value) {
    const map = {
      hobby: hobbies,
      skill: skills,
      goal: goals,
      achievement: achievements,
      interest: interests,
    };

    map[type] = map[type].filter((i) => i !== value);
    renderAllLists();
  }

  // ======================================
  // 8. CLICK TAGS
  // ======================================

  $(document).on("click", ".tag", function () {
    const type = $(this).data("type");
    const value = $(this).text();

    $(this).toggleClass("selected");

    if ($(this).hasClass("selected")) {
      addItem(type, value);
    } else {
      removeItem(type, value);
    }
  });

  // ======================================
  // 9. IMAGE UPLOAD
  // ======================================

  function setupImages() {
    $("#profileUpload").on("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (ev) {
        $(".profile_preview img").attr("src", ev.target.result);
      };
      reader.readAsDataURL(file);
    });

    $("#bannerUpload").on("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (ev) {
        $(".banner_preview img").attr("src", ev.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // ======================================
  // 10. SAVE PROFILE
  // ======================================

  function saveProfile() {
    const email = currentUser.email;

    const images = {
      profileImage: $(".profile_preview img").attr("src"),
      bannerImage: $(".banner_preview img").attr("src"),
    };

    const interests = {
      hobbies,
      skills,
      goals,
      achievements,
      interests,
    };

    const bio = {
      bio: $("#bio").val(),
      location: $("#Location").val(),
      github: $("#github").val(),
      linkedin: $("#linkedin").val(),
      phone: $("#phone").val(),
    };

    // save grouped data
    let allImages = JSON.parse(localStorage.getItem("profile_images")) || {};
    let allInterests = JSON.parse(localStorage.getItem("user_interests")) || {};
    let allBio = JSON.parse(localStorage.getItem("user_bio")) || {};

    allImages[email] = images;
    allInterests[email] = interests;
    allBio[email] = bio;

    localStorage.setItem("profile_images", JSON.stringify(allImages));
    localStorage.setItem("user_interests", JSON.stringify(allInterests));
    localStorage.setItem("user_bio", JSON.stringify(allBio));

    // update main user
    currentUser.profileImage = images.profileImage;
    currentUser.bannerImage = images.bannerImage;
    currentUser.bio = bio.bio;

    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

    alert("✅ Profile saved!");
    window.location.href = "Profile.html";
  }

  // ======================================
  // 11. INIT
  // ======================================

  function init() {
    fillForm();
    setupImages();

    $("#profileForm").on("submit", function (e) {
      e.preventDefault();
      saveProfile();
    });
  }

  init();

  // ======================================
  // SAFE TEXT
  // ======================================

  function escapeText(text) {
    return $("<div>").text(text).html();
  }
});
