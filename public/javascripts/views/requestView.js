var app = app || {};

(function() {

  app.RequestView = Backbone.View.extend({

    className: "request",

    events: {
      "click .requestUpvotes": "recordUpvote",
      "click .requestName a": "recordResponseView",
      "click .requestDestroy": "destroy"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", function() {
        var that = this;
        this.$el.fadeOut("slow", function() {
          that.remove();
        });
      });
    },

    render: function() {
      var requestTitle = "<div class=\"requestTitle\"><a class=\"publisherName\" href=\"/user/" + this.model.escape("publisherUsername") + "\">" + this.model.escape("publisherFirstname") + " " + this.model.escape("publisherLastname") + "</a> received a request.</div>";
      var requestDateTime = "<div class=\"requestDateTime\">" + app.dateTime.format(this.model.get("dateTime")) + "</div>";
      var responseViews = "";
      var requestDelete = "";
      var requestUpvotes = "<button class=\"requestUpvotes btn btn-schola btn-xs btn-block\"><span class=\"glyphicon glyphicon-chevron-up\"></span><div>" + this.model.get("upvotes") + "</div></button>";
      var requestName = "<div class=\"requestName\">" + this.model.escape("name") + "</div>";
      var requestOrigin = "<div class=\"requestOrigin\">from <span class=\"requesterName\">" + "anonymous" + "</span></div>";
      var responseDescription = "<div class=\"responseDescription\"><em>This request is pending an answer. Voice your demand for an answer with an upvote.</em></div>";

      if (this.isViewingOwnRequest())
        requestDelete = "<div class=\"requestDestroy\"><span class=\"glyphicon glyphicon-remove\"></span></div>";

      if (this.model.get("upvotingDisabled"))
        requestUpvotes = "<button class=\"requestUpvotes disabled btn btn-schola btn-xs btn-block\"><span class=\"glyphicon glyphicon-chevron-up\"></span><div>" + this.model.get("upvotes") + "</div></button>";

      if (!this.model.get("accessible"))
        requestUpvotes = "<button class=\"requestUpvotes clickSignUp btn btn-schola btn-xs btn-block\"><span class=\"glyphicon glyphicon-chevron-up\"></span><div>" + this.model.get("upvotes") + "</div></button>";

      if (this.model.get("status") === app.REQUEST_ANSWERED) {
        requestTitle = "<div class=\"requestTitle\"><a class=\"publisherName\" href=\"/user/" + this.model.escape("publisherUsername") + "\">" + this.model.escape("publisherFirstname") + " " + this.model.escape("publisherLastname") + "</a> answered a request.</div>";
        if (this.model.escape("responseUrl")) {
          requestName = "<div class=\"requestName\"><a href=\"" + this.model.escape("responseUrl") + "\" target=\"_blank\"><span class=\"glyphicon glyphicon-link\"></span> " + this.model.escape("name") + "</a></div>";
          responseViews = "<div class=\"responseViews\" data-toggle=\"tooltip\" title=\"" + this.model.get("responseViews") + " views\">" + this.model.get("responseViews") + " <span class=\"glyphicon glyphicon-eye-open\"></span>" + "</div>";
          if (!this.model.get("accessible"))
            requestName = "<div class=\"requestName clickSignUp\"><a><span class=\"glyphicon glyphicon-link\"></span> " + this.model.escape("name") + "</a></div>";
        }
        responseDescription = "<div class=\"responseDescription\">" + this.addLineBreaks(this.model.escape("responseDescription")) + "</div>";
      }

      this.$el.addClass("row");
      this.$el.html(
        "<div class=\"requestSide col-sm-5\">" + 
          requestTitle +
          requestDateTime + 
          responseViews + 
        "</div>" +
        "<div class=\"requestMain col-sm-7\">" + 
          requestDelete +
          requestUpvotes +
          requestName + 
          requestOrigin + 
          responseDescription +
        "</div>"
      );
      
      if (this.isViewingOwnRequest() &&
          this.model.get("status") === app.REQUEST_UNANSWERED)
        this.addResponseForm();

      return this;
    },

    addLineBreaks: function(text) {
      // This is pretty hacky. Is there a better solution?
      return text.replace(/\r\n|\r|\n/g, "<br>");
    },

    isViewingOwnRequest: function() {
      return this.model.escape("publisherUsername") === app.cookies.getCookie("username");
    },

    addResponseForm: function() {
      var responseFormView = new app.RequestResponseFormView({
        // Passed to requestResponseFormView's options hash.
        requestId: this.model.get("id")
      });
      this.$(".requestMain").append(
        responseFormView.render().el
      );
    },

    recordUpvote: function(e) {
      if (app.viewerData["isLoggedIn"])
        this.model.recordUpvote();
    },

    recordResponseView: function(e) {
      if (app.viewerData["isLoggedIn"])
        this.model.recordResponseView();
    },

    destroy: function(e) {
      this.model.destroy();
    }

  });

})();
