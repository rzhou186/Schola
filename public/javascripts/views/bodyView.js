var app = app || {};

(function() {

  app.BodyView = Backbone.View.extend({

    el: "body",

    events: {
      "click .promptSignUp": "promptSignUp"
    },

    promptSignUp: function() {
      this.$("#alerts").empty();
      this.$("#alerts").prepend(
        "<div class=\"alert alert-success\">" +
          "<button type=\"button\" class=\"close\"" +
            "data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
          "<strong>A username and password. </strong>" +
          "That's all we ask for. Sign up and unlock Schola." +
        "</div>"
      );
    }

  });

})();
