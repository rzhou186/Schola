var app = app || {};

(function() {

  app.SidebarView = Backbone.View.extend({

    el: "#sidebar",

    initialize: function() {
      if (this.isViewingHomePage())
        new app.TrendingView();
      else if (this.isViewingUserPage()) {
        var userModel = this.buildUserModel();
        new app.UserInfoView({
          model: userModel
        });
      }
    },

    buildUserModel: function() {
      return new app.User({
        username: app.pageData.username,
        description: app.pageData.description
      });
    },

    // This doesn't actually work.
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
