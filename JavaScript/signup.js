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
    const username = "@" + name.toLowerCase().replace(/\s+/g, "_");
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
      $(".password-match").text("Passwords match ✅").css("color", "lime");
    } else {
      $(".password-match")
        .text("Passwords do not match ❌")
        .css("color", "red");
    }
  });

  // =========================
  // HELPER: Load existing users from localStorage
  // =========================
  function loadAllUsers() {
    const usersJSON = localStorage.getItem("richfieldUsers");
    if (usersJSON) {
      return JSON.parse(usersJSON);
    }
    return [];
  }

  // =========================
  // HELPER: Save all users to localStorage and download as JSON file
  // =========================
  function saveAllUsersToStorageAndFile(users) {
    // Save to localStorage
    localStorage.setItem("richfieldUsers", JSON.stringify(users));

    // Also save individual current user for quick access
    const currentUser = users[users.length - 1];
    if (currentUser) {
      localStorage.setItem("richfieldUser", JSON.stringify(currentUser));
    }

    // Download/update the JSON file
    downloadUsersJSON(users);
  }

  // =========================
  // Download users array to JSON file
  // =========================
  function downloadUsersJSON(users) {
    const jsonStr = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "richfield_users.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // =========================
  // Check if username or email already exists
  // =========================
  function isUserExists(users, username, email) {
    return users.some(
      (user) => user.username === username || user.email === email,
    );
  }

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

    // Basic validation for required fields
    const requiredFields = ["#name", "#surname", "#email", "#student_id"];
    let isValid = true;
    requiredFields.forEach((field) => {
      if (!$(field).val().trim()) {
        alert(`Please fill in ${field.replace("#", "")}`);
        isValid = false;
      }
    });
    if (!isValid) return;

    // Get username from preview span (fallback to generated from name)
    let username = $("#generatedUsername").text().trim();
    if (!username || username === "@username") {
      const name = $("#name").val().trim();
      username =
        "@" + (name ? name.toLowerCase().replace(/\s+/g, "_") : "user");
    }

    const email = $("#email").val().trim();

    // Load existing users
    const existingUsers = loadAllUsers();

    // Check for duplicate username or email
    if (isUserExists(existingUsers, username, email)) {
      alert(
        "❌ User with this username or email already exists!\nPlease use different credentials.",
      );
      return;
    }

    // Generate unique ID for the user
    const userId =
      Date.now().toString() + Math.random().toString(36).substr(2, 6);

    // USER DATA OBJECT - collect all signup form details
    const newUser = {
      // Unique identifier
      userId: userId,

      // Personal Information
      name: $("#name").val().trim(),
      surname: $("#surname").val().trim(),
      username: username,
      email: email,
      studentId: $("#student_id").val().trim(),
      gender: $("#gender").val(),

      // Academic Information
      campus: $("#campus").val(),
      campusName: $("#campus").find(":selected").text(),
      yearOfStudy: $("#year").val(),
      yearName: $("#year").find(":selected").text(),

      // Security (In production, hash the password!)
      password: password,

      // Profile defaults (can be edited later)
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

      // Account metadata
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true,
    };

    // Add new user to existing users array
    const updatedUsers = [...existingUsers, newUser];

    // Save all users to localStorage and download JSON file
    saveAllUsersToStorageAndFile(updatedUsers);

    // Show loading state on button
    const $submitBtn = $("button[type='submit']");
    const originalText = $submitBtn.text();
    $submitBtn.text("Creating Account...").prop("disabled", true);

    // Simulate async operation and redirect
    setTimeout(() => {
      alert(
        `✅ Account created successfully! 🎉\n\nWelcome ${newUser.name}!\nTotal users registered: ${updatedUsers.length}\n\nUser data saved to "richfield_users.json"`,
      );
      // Reset button
      $submitBtn.text(originalText).prop("disabled", false);
      // Redirect to profile page
      window.location.href = "Profile.html";
    }, 1500);
  });

  // =========================
  // FUNCTION: Load and display all users (for admin/debugging)
  // =========================
  window.getAllUsers = function () {
    const users = loadAllUsers();
    console.log("All registered users:", users);
    alert(
      `Total users registered: ${users.length}\nCheck console for details.`,
    );
    return users;
  };

  // =========================
  // FUNCTION: Find user by email or username
  // =========================
  window.findUser = function (identifier) {
    const users = loadAllUsers();
    const user = users.find(
      (u) => u.email === identifier || u.username === identifier,
    );
    if (user) {
      console.log("User found:", user);
      alert(
        `User found:\nName: ${user.name}\nEmail: ${user.email}\nUsername: ${user.username}`,
      );
      return user;
    } else {
      alert("User not found!");
      return null;
    }
  };

  // =========================
  // FUNCTION: Export all users manually
  // =========================
  window.exportUsersJSON = function () {
    const users = loadAllUsers();
    if (users.length === 0) {
      alert("No users found in the database.");
      return;
    }
    downloadUsersJSON(users);
    alert(`Exported ${users.length} users to richfield_users.json`);
  };

  // =========================
  // FUNCTION: Clear all users (with confirmation)
  // =========================
  window.clearAllUsers = function () {
    if (
      confirm(
        "⚠️ WARNING: This will delete ALL registered users! Are you sure?",
      )
    ) {
      localStorage.removeItem("richfieldUsers");
      localStorage.removeItem("richfieldUser");
      alert("All users have been deleted.");
      console.log("User database cleared.");
    }
  };

  // =========================
  // Auto-load and display user count on page load
  // =========================
  const userCount = loadAllUsers().length;
  console.log(`Richfield Connect - ${userCount} user(s) registered`);
});
