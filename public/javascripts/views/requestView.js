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
    },

    render: function() {
      var requestTitle = "<div class=\"requestTitle\"><a class=\"satisfierName\" href=\"/user/" + this.model.get("satisfierName") + "\">" + this.model.get("satisfierName") + "</a> received a request.</div>";
      var requestDateTime = "<div class=\"requestDateTime\">" + app.dateTime.format(this.model.get("dateTime")) + "</div>";
      var responseViews = "";
      var requestDelete = "";
      var requestUpvotes = "<button class=\"requestUpvotes btn btn-schola btn-xs btn-block\"><span class=\"glyphicon glyphicon-chevron-up\"></span><div>" + this.model.get("upvotes") + "</div></button>";
      var requestName = "<div class=\"requestName\">" + this.model.get("name") + "</div>";
      var requestOrigin = "<div class=\"requestOrigin\">from <span class=\"requesterName\">" + "anonymous" + "</span></div>";
      var responseDescription = "<div class=\"responseDescription\"><em>This request is pending a response.</em></div>";

      if (this.isViewingOwnRequest())
        requestDelete = "<div class=\"requestDestroy\"><span class=\"glyphicon glyphicon-remove\"></span></div>";

      if (!this.model.get("accessible"))
        requestUpvotes = "<button class=\"requestUpvotes clickSignUp btn btn-schola btn-xs btn-block\"><span class=\"glyphicon glyphicon-chevron-up\"></span><div>" + this.model.get("upvotes") + "</div></button>";

      if (this.model.get("status") === app.REQUEST_SATISFIED) {
        requestTitle = "<div class=\"requestTitle\"><a class=\"satisfierName\" href=\"/user/" + this.model.get("satisfierName") + "\">" + this.model.get("satisfierName") + "</a> satisfied a request.</div>";
        responseViews = "<div class=\"responseViews\" data-toggle=\"tooltip\" title=\"" + this.model.get("responseViews") + " views\">" + this.model.get("responseViews") + " <span class=\"glyphicon glyphicon-eye-open\"></span>" + "</div>";
        requestName = "<div class=\"requestName\"><a href=\"" + this.model.get("responseUrl") + "\" target=\"_blank\">" + this.model.get("name") + "</a></div>";
        responseDescription = "<div class=\"responseDescription\">" + this.model.get("responseDescription") + "</div>";

        if (!this.model.get("accessible")) {
          requestName = "<div class=\"requestName clickSignUp\"><a>" + this.model.get("name") + "</a></div>";
        }
      }

      this.$el.html(
        "<div class=\"requestSide\">" + 
          requestTitle +
          requestDateTime + 
          responseViews + 
        "</div>" +
        "<div class=\"requestMain\">" + 
          requestDelete +
          requestUpvotes +
          requestName + 
          requestOrigin + 
          responseDescription +
        "</div>"
      );
      
      if (this.isViewingOwnRequest() &&
          this.model.get("status") === app.REQUEST_NOT_SATISFIED)
        this.addResponseForm();

      return this;
    },

    isViewingOwnRequest: function() {
      return this.model.get("satisfierName") === app.cookies.getCookie("username");
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
      if (app.viewerData.isLoggedIn) {
        this.model.incrementUpvotes();
      }
    },

    recordResponseView: function(e) {
      if (app.viewerData.isLoggedIn) {
        this.model.incrementResponseViews();
      }
    },

    destroy: function(e) {
      this.model.destroy();
    }

  });

})();
