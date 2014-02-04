var app = app || {};

(function() {

  app.SidebarView = Backbone.View.extend({

    el: "#sidebar",

    initialize: function() {
      if (this.isViewingUserPage()){
        var userModel = this.buildUserModel();
        new app.UserInfoView({
          model: userModel
        });
      }
      else
        // This doesn't actually work.
        new app.TrendingView();
    },

    buildUserModel: function() {
      return new app.User({
        firstname: app.pageData["firstname"],
        lastname: app.pageData["lastname"],
        description: app.pageData["description"]
      });
    },

    isViewingUserPage: function() {
      if (app.pageData) return true;
      return false;
    }

  });

})();
