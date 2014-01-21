var app = app || {};

(function() {

  app.PostView = Backbone.View.extend({

    events: {
      "click .postName": "recordView",
      "click .postGet": "recordView"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    render: function() {
      var postDate = app.dateTime.format(this.model.get("dateTime"));
      var postName = "<a href=\"" + this.model.get("url") + "\" target=\"_blank\">" + this.model.get("name") + "</a>";
      var postGet = "<a class=\"btn btn-schola btn-xs\" target=\"_blank\" href=\"" + this.model.get("url") + "\">View</a>";
      this.$el.html(
        "<div class=\"post\" id=" + this.model.get("id") + ">" + 
          "<div class=\"postSide\">" + 
            "<div class=\"postTitle\">" + 
              "<span class=\"postUsername\"></span>" + 
              "added a post." + 
            "</div>" + 
            "<div class=\"postDate\">" + postDate + "</div>" + 
            "<div class=\"postViewsContainer\" data-toggle=\"tooltip\" title=\"" + 
              this.model.get("views") + " views\">" + 
              "<span class=\"postViews\">" + this.model.get("views") + "</span>" +
              " <span class=\"glyphicon glyphicon-eye-open\"></span>" + 
            "</div>" + 
          "</div>" +
          "<div class=\"postMain\">" + 
            "<div class=\"postIcon\" data-toggle=\"tooltip\" title=\"Link\">" + 
              "<span class=\"glyphicon glyphicon-link\"></span>" + 
            "</div>" + 
            "<div class=\"postName\">" + postName + "</div>" + 
            "<div class=\"postDescription\">" + 
              "<p>" + this.model.get("description") + "</p>" + 
            "</div>" + 
            "<div class=\"postGet\">" + postGet + "</div>" + 
          "</div>" + 
        "</div>"
      );
      return this;
    },

    recordView: function(e) {
      // Where should the screening for promptSignUp happen? here or in events?
      // I think i like here better.
      // this.model.incrementViews();
      console.log($(e.target).attr("class"));
    }

  });

})();
