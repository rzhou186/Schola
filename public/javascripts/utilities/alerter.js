var app = app || {};

(function() {

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
  };

  Alerter.prototype.confirm = function(message) {
    $("#alerts").empty();
    var alert = $(
      "<div class=\"alert alert-success\">" +
        "<strong>" + message + "</strong>" +
      "</div>"
    );
    $("#alerts").prepend(alert);
    setTimeout(function(){
      alert.fadeOut(500);
    }, 1000);
  };

  Alerter.prototype.remind = function(message) {
    $("#alerts").empty();
    var reminder = $(
      "<div class=\"alert alert-success\">" +
        "<button type=\"button\" class=\"close\"" +
          "data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        message + 
      "</div>"
    );
    $("#alerts").prepend(reminder);
  }

  Alerter.prototype.clear = function(message) {
    $("#alerts").empty();
  };

  app.alerter = new Alerter();

})();