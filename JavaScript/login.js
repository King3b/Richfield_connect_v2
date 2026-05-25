$(document).ready(function () {
  // AUTO LOGIN CHECK
  if (localStorage.getItem("loggedInUser")) {
    window.location.href = "Feed.html";
  }

  // LOGIN FORM
  $("#profileForm").submit(function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    // GET USER
    const savedUser = JSON.parse(localStorage.getItem("richfieldUser"));

    // VALIDATION
    if (!savedUser) {
      alert("No account found ❌");
      return;
    }

    // LOGIN SUCCESS
    if (savedUser.email === email && savedUser.password === password) {
      $("button").text("Logging in...");

      localStorage.setItem("loggedInUser", JSON.stringify(savedUser));

      setTimeout(() => {
        alert(`Welcome back ${savedUser.name} 🎉`);
        window.location.href = "Feed.html";
      }, 1200);
    } else {
      $(".login").addClass("shake");

      setTimeout(() => {
        $(".login").removeClass("shake");
      }, 400);

      alert("Incorrect email or password ❌");
    }
  });
});
