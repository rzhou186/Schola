var app = app || {};

(function() {

  app.BodyView = Backbone.View.extend({

    el: "body",

    events: {
      "click .clickSignUp": "promptSignUp",
      "submit .submitSignUp": "promptSignUp"
    },

    initialize: function() {
      this.enableTooltips();
    },

    promptSignUp: function() {
      var message = "<strong>A username and password.</strong><br>" +
        "That's literally all we ask for. Sign up to unlock Schola.";
      app.alerter.remind(message);
    },

    enableTooltips: function() {
      this.$el.tooltip({
        selector: "[data-toggle=\"tooltip\"]",
        placement: "left"
      });
    }

  });

})();
