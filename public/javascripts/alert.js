var app = app || {};

$(document).on("click", ".promptSignUp", function() {
  $("#alerts").empty();
  $("#alerts").prepend(
    "<div class=\"alert alert-success\">" +
      "<button type=\"button\" class=\"close\"" +
        "data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
      "<strong>A username and password. </strong>" +
      "That's all we ask for. Sign up above to unlock Schola." +
    "</div>"
  );
});