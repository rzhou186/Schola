var app = app || {};

$("#logOut").click(function(event) {
  event.preventDefault();
  app.cookie.deleteCookie("username");
  app.cookie.deleteCookie("password");
  location.reload();
});