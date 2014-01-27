var app = app || {};

(function() {

  app.UserInfoView = Backbone.View.extend({

    el: "#userInfo",

    initialize: function() {
      this.populateUsername();
      this.populateDescription();
    },

    populateUsername: function() {
      var username = app.pageData.username;
      this.$(".userUsername").prepend(username);
    },

    populateDescription: function() {
      var description = "<em>This user has not provided a user description yet.</em>";
      this.$(".userDescription").html(description);
    }

  });

})();
