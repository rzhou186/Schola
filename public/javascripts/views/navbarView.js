var app = app || {};

(function() {

  app.NavbarView = Backbone.View.extend({

    el: "#navbar",

    initialize: function() {
      new app.LogInFormView();
      new app.SignUpFormView();
      new app.LogOutView
      this.enableUserAccess();
    },

    enableUserAccess: function() {
      // userAccess is rendered only for moderators.
      var userAccess = this.$el.find("#userAccess");
      if (userAccess.length) {
        var username = app.cookies.getCookie("username");
        userAccess.html(username);
        userAccess.attr("href", "/user/" + username);
      }
    }

  });

})();
