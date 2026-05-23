// =========================
// LOAD PROFILE DATA
// =========================

const profileData = JSON.parse(localStorage.getItem("profileData")) || {};

// =========================
// PROFILE DETAILS
// =========================

document.getElementById("profileName").textContent =
  profileData.name || "Please edit your name";

document.getElementById("profileUsername").textContent =
  profileData.username || "@please_edit_profile";

document.getElementById("profileBio").textContent =
  profileData.bio || "Please add your bio";

document.getElementById("profileCourse").textContent =
  profileData.course || "Please add your course";

document.getElementById("profileYear").textContent =
  profileData.year || "Please add your academic year";

// =========================
// OVERVIEW
// =========================

document.getElementById("overviewName").textContent =
  profileData.name || "Please edit your full name";

document.getElementById("overviewCourse").textContent =
  profileData.course || "Please add your course";

document.getElementById("overviewLocation").textContent =
  profileData.location || "Please add your location";

document.getElementById("highSchool").textContent =
  profileData.highschool || "Please add high school";

document.getElementById("fieldStudy").textContent =
  profileData.fieldstudy || "Please add field of study";

// =========================
// LINKS
// =========================

if (profileData.github) {
  document.getElementById("githubLink").href = profileData.github;

  document.getElementById("githubLink").textContent = "GitHub";
}

if (profileData.linkedin) {
  document.getElementById("linkedinLink").href = profileData.linkedin;

  document.getElementById("linkedinLink").textContent = "LinkedIn";
}

if (profileData.portfolio) {
  document.getElementById("portfolioLink").href = profileData.portfolio;

  document.getElementById("portfolioLink").textContent = "Portfolio";
}

// =========================
// LOAD IMAGES
// =========================

const savedProfile = localStorage.getItem("profileImage");

const savedBanner = localStorage.getItem("bannerImage");

if (savedProfile) {
  document.getElementById("profileImage").src = savedProfile;
}

if (savedBanner) {
  document.getElementById("bannerImage").src = savedBanner;
}

// =========================
// PROFILE COMPLETION
// =========================

const profileFields = [
  profileData.name,
  profileData.username,
  profileData.bio,
  profileData.course,
  profileData.location,
  profileData.github,
  profileData.linkedin,
  profileData.portfolio,
];

const completedFields = profileFields.filter(Boolean).length;

const completion = Math.floor((completedFields / profileFields.length) * 100);

document.getElementById("completionPercent").textContent = `${completion}%`;

document.getElementById("completionFill").style.width = `${completion}%`;

// =========================
// THEME MODE
// =========================

const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light_mode");

  if (themeBtn) {
    themeBtn.textContent = "☀";
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light_mode");

    if (document.body.classList.contains("light_mode")) {
      localStorage.setItem("theme", "light");

      themeBtn.textContent = "☀";
    } else {
      localStorage.setItem("theme", "dark");

      themeBtn.textContent = "🌙";
    }
  });
}
