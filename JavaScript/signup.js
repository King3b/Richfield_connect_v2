$(document).ready(function () {
  const selectedTags = [];

  // SHOW PASSWORD

  $("#togglePassword").click(function () {
    let input = $("#password");

    if (input.attr("type") === "password") {
      input.attr("type", "text");

      $(this).text("visibility_off");
    } else {
      input.attr("type", "password");

      $(this).text("visibility");
    }
  });

  // LIVE NAME PREVIEW

  $("#name").on("input", function () {
    let name = $(this).val();

    $(".preview-name").text(name);

    let username = "@" + name.toLowerCase().replace(/\s/g, "_");

    $("#generatedUsername").text(username);

    $(".preview-username").text(username);
  });

  // CAMPUS PREVIEW

  $("#campus").change(function () {
    $(".preview-campus").text($(this).find(":selected").text());
  });

  // PASSWORD STRENGTH

  $("#password").on("input", function () {
    let password = $(this).val();

    let strength = 0;

    if (password.length >= 8) strength++;

    if (/[A-Z]/.test(password)) strength++;

    if (/[0-9]/.test(password)) strength++;

    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength === 1) {
      $(".strength-bar").css({
        width: "25%",
        background: "red",
      });

      $(".strength-text").text("Weak Password");
    }

    if (strength === 2) {
      $(".strength-bar").css({
        width: "50%",
        background: "orange",
      });

      $(".strength-text").text("Medium Password");
    }

    if (strength >= 3) {
      $(".strength-bar").css({
        width: "100%",
        background: "lime",
      });

      $(".strength-text").text("Strong Password");
    }
  });

  // PASSWORD MATCH

  $("#confirm_password").on("input", function () {
    let password = $("#password").val();

    let confirm = $(this).val();

    if (password === confirm) {
      $(".password-match").text("Passwords match").css("color", "lime");
    } else {
      $(".password-match").text("Passwords do not match").css("color", "red");
    }
  });

  // INTEREST TAGS

  $(".tag").click(function () {
    $(this).toggleClass("selected");

    let value = $(this).text();

    if (selectedTags.includes(value)) {
      selectedTags.splice(selectedTags.indexOf(value), 1);
    } else {
      selectedTags.push(value);
    }

    $(".preview-tags").html("");

    selectedTags.forEach((tag) => {
      $(".preview-tags").append(`
        <span>${tag}</span>
      `);
    });
  });

  // FORM SUBMIT

  $("#signup-form").submit(function (e) {
    e.preventDefault();

    let user = {
      name: $("#name").val(),

      surname: $("#surname").val(),

      email: $("#email").val(),

      username: $("#generatedUsername").text(),

      campus: $("#campus").val(),

      password: $("#password").val(),

      interests: selectedTags,
    };

    localStorage.setItem("user", JSON.stringify(user));

    $("button").text("Creating Account...");

    setTimeout(() => {
      window.location.href = "Profile.html";
    }, 2000);
  });
});
