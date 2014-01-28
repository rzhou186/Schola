var app = app || {};

(function() {

  app.SidebarView = Backbone.View.extend({

    el: "#sidebar",

    initialize: function() {
      if (this.isViewingHomePage())
        new app.TrendingUsersView();
      else if (this.isViewingUserPage()) {
        var userModel = this.buildUserModel();
        new app.UserInfoView({
          model: userModel
        });
      }
    },

    buildUserModel: function() {
      return new app.User({
        username: app.pageData.username
      });
    },

    // Find a better way to determine the page being viewed.
    isViewingHomePage: function() {
      if (!app.pageData) return true;
      return false;
    },

    isViewingUserPage: function() {
      if (app.pageData) return true;
      return false;
    }

  });

})();
