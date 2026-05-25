$(document).ready(function () {
  const selectedTags = [];

  // =========================
  // SHOW / HIDE PASSWORD
  // =========================

  $("#togglePassword").click(function () {
    const passwordInput = $("#password");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
      $(this).text("visibility_off");
    } else {
      passwordInput.attr("type", "password");
      $(this).text("visibility");
    }
  });

  // =========================
  // LIVE NAME + USERNAME PREVIEW
  // =========================

  $("#name").on("input", function () {
    const name = $(this).val().trim();

    $(".preview-name").text(name || "Your Name");

    const username =
      "@" + name.toLowerCase().replace(/\s+/g, "_");

    $("#generatedUsername").text(username);
    $(".preview-username").text(username);
  });

  // =========================
  // CAMPUS PREVIEW
  // =========================

  $("#campus").change(function () {
    const campus = $(this).find(":selected").text();

    $(".preview-campus").text(campus);
  });

  // =========================
  // PASSWORD STRENGTH
  // =========================

  $("#password").on("input", function () {
    const password = $(this).val();

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    let width = "0%";
    let color = "red";
    let text = "Weak Password";

    if (strength === 2) {
      width = "50%";
      color = "orange";
      text = "Medium Password";
    }

    if (strength >= 3) {
      width = "100%";
      color = "lime";
      text = "Strong Password";
    }

    $(".strength-bar").css({
      width: width,
      background: color,
    });

    $(".strength-text").text(text);
  });

  // =========================
  // PASSWORD MATCH CHECK
  // =========================

  $("#confirm_password").on("input", function () {
    const password = $("#password").val();
    const confirmPassword = $(this).val();

    if (password === confirmPassword) {
      $(".password-match")
        .text("Passwords match ✅")
        .css("color", "lime");
    } else {
      $(".password-match")
        .text("Passwords do not match ❌")
        .css("color", "red");
    }
  });



  // =========================
  // FORM SUBMIT
  // =========================

  $("#signupForm").submit(function (e) {
    e.preventDefault();

    const password = $("#password").val();
    const confirmPassword = $("#confirm_password").val();

    // PASSWORD VALIDATION
    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    // USER DATA
    const userData = {
      name: $("#name").val(),
      surname: $("#surname").val(),
      username: $("#generatedUsername").text(),
      email: $("#email").val(),
      campus: $("#campus").val(),
      year: $("#year").val(),
      course: $("#course").val(),
      password: password,

      bio: "No bio added yet ✨",
      location: "",
      github: "",
      linkedin: "",
      portfolio: "",

      hobbies: [],
      skills: [],
      achievements: [],

      interests: selectedTags,

      profileImage: "",
      bannerImage: "",
    };

    // SAVE USER
    localStorage.setItem(
      "richfieldUser",
      JSON.stringify(userData)
    );

    // BUTTON LOADING
    $("button[type='submit']").text(
      "Creating Account..."
    );

    // SUCCESS
    setTimeout(() => {
      alert("Account created successfully 🎉");
      window.location.href = "Profile.html";
    }, 1500);
  });
});