var app = app || {};

(function() {

  app.UserInfoView = Backbone.View.extend({

    el: "#userInfo",

    initialize: function() {
      this.populateName();
      this.populateDescription();
    },

    populateName: function() {
      var fullname = this.model.escape("firstname") + " " + this.model.escape("lastname");
      this.$(".userName").append(
        "<div class=\"glyphicon glyphicon-user\"></div>" + 
        "<div class=\"userNameText\">" + 
          fullname +
        "</div>"
      );
    },

    populateDescription: function() {
      var description = this.model.escape("description");
      if (!description)
        description = "<em>This publisher has not provided a self-description yet.</em>";
      this.$(".userDescription").html(description);
    }

  });

})();
