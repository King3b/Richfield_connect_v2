$(document).ready(function () {
  $("form").submit(function (e) {
    e.preventDefault();

    let email = $("#email").val();

    let password = $("#password").val();

    let user = JSON.parse(localStorage.getItem("user"));

    if (email === user.email && password === user.password) {
      $("button").text("Logging in...");

      localStorage.setItem("currentUser", user.username);

      setTimeout(() => {
        window.location.href = "Feed.html";
      }, 1500);
    } else {
      $(".login").addClass("shake");

      setTimeout(() => {
        $(".login").removeClass("shake");
      }, 300);
    }
  });
});
