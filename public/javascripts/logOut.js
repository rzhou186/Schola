var app = app || {};

$("#logOut").click(function(event) {
  event.preventDefault();
  app.cookies.deleteCookie("username");
  app.cookies.deleteCookie("password");
  location.reload();
});