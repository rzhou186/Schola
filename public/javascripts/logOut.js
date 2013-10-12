$("#logOut").click(function(event) {
  event.preventDefault();
  deleteCookie("username");
  deleteCookie("password");
  location.reload();
});