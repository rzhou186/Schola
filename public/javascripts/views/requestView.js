var app = app || {};

(function() {

  app.RequestView = Backbone.View.extend({

    events: {
      // Add listener for click on upvote button
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    render: function() {
      var requestDate = app.dateTime.format(this.model.get("dateTime"));
      var requestName = this.model.get("name");
      
      if (this.model.get("status") === 1) { // This should be a constant
        if (this.model.get("openable")) {
          requestName = "<a href=\"" + this.model.get("url") + "\" target=\"_blank\">" + this.model.get("name") + "</a>";
        }
        else requestName = "<a class=\"promptSignUp\">" + this.model.get("name") + "</a>";
      }

      this.$el.html(
        "<div class=\"request\" id=" + this.model.get("id") + ">" + 
          "<div class=\"requestSide\">" + 
            "<div class=\"requestTitle\">" + 
              "Hello world!" +
            "</div>" +
            "<div class=\"requestDateTime\">" + 
              requestDate + 
            "</div>" +
            "<div class=\"requestViews\" data-toggle=\"tooltip\" title=\"" + 
              "20" + " views\">" + 
              "20" +
              " <span class=\"glyphicon glyphicon-eye-open\"></span>" + 
            "</div>" + 
          "</div>" + 
          "<div class=\"requestMain\">" + 
            "<button class=\"requestUpvotes btn btn-schola btn-xs btn-block\">" + 
              "<span class=\"glyphicon glyphicon-chevron-up\"></span>" + 
              "<div>" + this.model.get("upvotes") + "</div>" + 
            "</button>" + 
            "<div class=\"requestName\">" +
              requestName +
            "</div>" + 
            "<div class=\"requestDescription\">" + 
              "<p>" + "I like trains." + "</p>" + 
            "</div>" + 
            "</br>" + 
          "</div>" + 
        "</div>"
      );
      return this;
    },

    recordView: function(e) {
      // Where should the screening for promptSignUp happen? here or in events?
      // I think i like here better.
      // this.model.incrementUpvotes();
    }

  });

})();
