function globalAlert(message) {
  $(".globalAlerts").empty();
  var alert = $(
    "<div class=\"alert alert-danger\">" +
      "<strong>" + message + "</strong>" +
    "</div>"
  );
  $(".globalAlerts").prepend(alert);
  setTimeout(function(){
    alert.fadeOut(500);
  }, 1000);
}