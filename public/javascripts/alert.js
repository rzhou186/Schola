var app = app || {};

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

$(document).on("click", ".promptSignup", function() {
  $(".globalAlerts").empty();
  $(".globalAlerts").prepend(
    "<div class=\"alert alert-success\">" +
      "<button type=\"button\" class=\"close\"" +
        "data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
      "<strong>A username and password. </strong>" +
      "That's all we ask for. Sign up above to unlock Schola." +
    "</div>"
  );
});