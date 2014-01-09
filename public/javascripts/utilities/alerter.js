var app = app || {};

(function () {

  var Alerter = function() {};

  Alerter.prototype.alert = function(message) {
    $("#alerts").empty();
    var alert = $(
      "<div class=\"alert alert-danger\">" +
        "<strong>" + message + "</strong>" +
      "</div>"
    );
    $("#alerts").prepend(alert);
    setTimeout(function(){
      alert.fadeOut(500);
    }, 1000);
  }

  app.alerter = new Alerter();

})();