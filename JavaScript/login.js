$(document).ready(function () {
  // AUTO LOGIN CHECK
  if (localStorage.getItem("loggedInUser")) {
    window.location.href = "Feed.html";
  }

  // API endpoint for your JSON file
  const JSON_FILE_PATH = "assets/richfield_users.json"; // Adjust path if needed

  // Function to load users from JSON file
  async function loadUsersFromJSON() {
    try {
      const response = await fetch(JSON_FILE_PATH);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error("Error loading users.json:", error);
      // Fallback to localStorage if JSON file fails to load
      const localUsers = localStorage.getItem("richfieldUsers");
      if (localUsers) {
        return JSON.parse(localUsers);
      }
      return [];
    }
  }

  // Function to find user by email
  function findUserByEmail(users, email) {
    return users.find((user) => user.email === email);
  }

  // Function to validate password
  function validatePassword(user, password) {
    return user && user.password === password;
  }

  // LOGIN FORM SUBMIT
  $("#profileForm").submit(async function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    // Validate inputs
    if (!email || !password) {
      alert("Please enter both email and password ❌");
      return;
    }

    // Show loading state
    const $submitBtn = $("button[type='submit']");
    const originalText = $submitBtn.text();
    $submitBtn.text("Logging in...").prop("disabled", true);

    try {
      // Load all users from JSON file
      const allUsers = await loadUsersFromJSON();

      console.log(`Loaded ${allUsers.length} users from database`); // Debug log

      // Find user by email
      const user = findUserByEmail(allUsers, email);

      // Small delay to simulate network request
      setTimeout(() => {
        // Validate user exists and password matches
        if (user && validatePassword(user, password)) {
          // Save to localStorage for session management
          localStorage.setItem("loggedInUser", JSON.stringify(user));

          // Also update the current user in localStorage
          localStorage.setItem("richfieldUser", JSON.stringify(user));

          // Success animation/message
          alert(`Welcome back ${user.name} ${user.surname || ""}! 🎉`);

          // Redirect to feed page
          window.location.href = "Feed.html";
        } else {
          // Failed login - add shake animation
          $(".login").addClass("shake");

          setTimeout(() => {
            $(".login").removeClass("shake");
          }, 400);

          alert("Incorrect email or password ❌\nPlease try again.");

          // Reset button
          $submitBtn.text(originalText).prop("disabled", false);

          // Clear password field for security
          $("#password").val("");
        }
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      alert("Error connecting to database. Please try again later. ❌");
      $submitBtn.text(originalText).prop("disabled", false);
    }
  });

  // Optional: Add "Show Password" toggle if you have the element
  if ($("#togglePassword").length) {
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
  }

  // Optional: Add demo account for testing
  window.demoLogin = async function () {
    const users = await loadUsersFromJSON();
    if (users && users.length > 0) {
      const demoUser = users[0];
      $("#email").val(demoUser.email);
      $("#password").val(demoUser.password);
      alert(`Demo account loaded: ${demoUser.email}\nClick login to continue`);
    } else {
      alert("No users found in database. Please sign up first.");
    }
  };
});
