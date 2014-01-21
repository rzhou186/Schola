var app = app || {};

(function() {

  app.NavbarView = Backbone.View.extend({

    el: "#navbar",

    initialize: function() {
      new app.LogInFormView();
      new app.SignUpFormView();
      new app.LogOutView();
      this.enableProfileAccess();
    },

    enableProfileAccess: function() {
      // profileAccess is rendered only for moderators.
      var profileAccess = this.$el.find("#profileAccess");
      if (profileAccess.length) {
        var username = app.cookies.getCookie("username");
        profileAccess.html(username);
        profileAccess.attr("href", username);
      }
    }

  });

})();
