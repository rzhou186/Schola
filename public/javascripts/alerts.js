function globalAlert(message) {
  var alert = $(
    "<div class=\"alert alert-danger\">" +
      "<strong>" + message + "</strong>" +
    "</div>"
  );
  $(".globalAlerts").append(alert);
  setTimeout(function(){
    alert.fadeOut(500);
  }, 3000);
}