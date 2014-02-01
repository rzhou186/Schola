var app = app || {};

(function() {

  app.UserInfoView = Backbone.View.extend({

    el: "#userInfo",

    initialize: function() {
      this.populateUsername();
      this.populateDescription();
    },

    populateUsername: function() {
      var username = this.model.get("username");
      this.$(".userUsername").prepend(username);
    },

    populateDescription: function() {
      var description = this.model.get("description");
      if (!description)
        description = "<em>This publisher has not provided a self-description yet.</em>";
      this.$(".userDescription").html(description);
    }

  });

})();
