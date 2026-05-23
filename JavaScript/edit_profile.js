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

// =========================
// FORM
// =========================

const form = document.getElementById("profileForm");

// =========================
// IMAGE PREVIEW
// =========================

const profileUpload = document.getElementById("profileUpload");

const bannerUpload = document.getElementById("bannerUpload");

if (profileUpload) {
  profileUpload.addEventListener("change", function (e) {
    const reader = new FileReader();

    reader.onload = function () {
      document.querySelector(".profile_preview img").src = reader.result;

      localStorage.setItem("profileImage", reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  });
}

if (bannerUpload) {
  bannerUpload.addEventListener("change", function (e) {
    const reader = new FileReader();

    reader.onload = function () {
      document.querySelector(".banner_preview img").src = reader.result;

      localStorage.setItem("bannerImage", reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  });
}

// =========================
// HOBBIES
// =========================

const hobbyInput = document.getElementById("hobbyInput");

const addHobby = document.getElementById("addHobby");

const hobbyList = document.getElementById("hobbyList");

let hobbies = JSON.parse(localStorage.getItem("hobbies")) || [];

function renderHobbies() {
  hobbyList.innerHTML = "";

  hobbies.forEach((hobby) => {
    hobbyList.innerHTML += `
      <button class="tag">
        ${hobby}
      </button>
    `;
  });

  localStorage.setItem("hobbies", JSON.stringify(hobbies));
}

renderHobbies();

if (addHobby) {
  addHobby.addEventListener("click", () => {
    if (hobbyInput.value.trim() !== "") {
      hobbies.push(hobbyInput.value);

      renderHobbies();

      hobbyInput.value = "";
    }
  });
}

// =========================
// ACHIEVEMENTS
// =========================

const achievementInput = document.getElementById("achievementInput");

const achievementBtn = document.getElementById("addAchievement");

const achievementList = document.querySelector(".achievement_list");

if (achievementBtn) {
  achievementBtn.addEventListener("click", () => {
    if (achievementInput.value.trim() !== "") {
      const li = document.createElement("li");

      li.innerHTML = `
        <span>
          ${achievementInput.value}
        </span>

        <button type="button">
          Remove
        </button>
      `;

      achievementList.appendChild(li);

      achievementInput.value = "";
    }
  });
}

// =========================
// SAVE PROFILE
// =========================

if (form) {
  form.addEventListener("submit", function (e) {
    const name = document.getElementById("name");

    const error = document.querySelector(".error");

    if (name.value.trim() === "") {
      e.preventDefault();

      if (error) {
        error.textContent = "Please enter your name";
      }

      return;
    }

    localStorage.setItem(
      "profileData",
      JSON.stringify({
        name: document.getElementById("name").value,

        username: document.getElementById("username").value,

        bio: document.getElementById("bio").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        github: document.getElementById("github").value,

        linkedin: document.getElementById("linkedin").value,

        portfolio: document.getElementById("portfolio").value,

        course: document.getElementById("course").value,

        year: document.getElementById("year").value,

        location: document.getElementById("location").value,

        highschool: document.getElementById("highschool").value,

        fieldstudy: document.getElementById("fieldstudy").value,
      }),
    );

    const popup = document.getElementById("popup");

    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);
  });
}
