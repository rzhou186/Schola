var app = app || {};

(function() {

  app.RequestView = Backbone.View.extend({

    events: {
      // "click .requestUpvotes": recordUpvote
      // "click .requestName": recordResponseView,
    },

    initialize: function() {
      if (this.isViewingOwnUser() &&
          this.model.status === REQUEST_NOT_SATISFIED)
        this.addResponseForm();

      this.listenTo(this.model, "change", this.render);
    },

    render: function() {
      var requestTitle = "<span class=\"satisfierName\">" + this.model.get("satisfierName") + "</span> received a request.";
      var requestDateTime = app.dateTime.format(this.model.get("dateTime"));
      var requestViews = "";
      var requestUpvotes = this.model.get("upvotes");
      var requestName = this.model.get("name");
      var requestOrigin = "from <span class=\"requesterName\">" + this.model.get("requesterName") + "</span>";
      var requestDescription = "<em>This request is pending a response.</em>";

      if (this.model.status === REQUEST_SATISFIED) {
        requestTitle = "<span class=\"satisfierName\">" + this.model.get("satisfierName") + "</span> satisfied a request.";
        requestViews = "<div class=\"requestViews\" data-toggle=\"tooltip\" title=\"" + this.model.get("responseViews") + " views\">" + this.model.get("responseViews") + " <span class=\"glyphicon glyphicon-eye-open\"></span>" + "</div>";
        requestName = "<a href=\"" + this.model.get("responseURL") + "\" target=\"_blank\">" + this.model.get("name") + "</a>";
        requestDescription = this.model.get("responseDescription");

        if (!this.model.get("openable"))
          requestName = "<a class=\"promptSignUp\">" + this.model.get("name") + "</a>";
      }

      this.$el.html(
        "<div class=\"request\">" + 
          "<div class=\"requestSide\">" + 
            "<div class=\"requestTitle\">" + 
              requestTitle +
            "</div>" +
            "<div class=\"requestDateTime\">" + 
              requestDateTime + 
            "</div>" +
            requestViews + 
          "</div>" +
          "<div class=\"requestMain\">" + 
            "<button class=\"requestUpvotes btn btn-schola btn-xs btn-block\">" + 
              "<span class=\"glyphicon glyphicon-chevron-up\"></span>" + 
              requestUpvotes + 
            "</button>" + 
            "<div class=\"requestName\">" + 
              requestName + 
            "</div>" +
            "<div class=\"requestOrigin\">" +
              requestOrigin + 
            "</div>" +
            "<div class=\"requestDescription\">" + 
              responseDescription +
            "</div>" +
          "</div>" + 
        "</div>" 
      );
      return this;
    },

    isViewingOwnUser: function() {
      if (!app.pageData) return false;
      return app.pageData.username === app.cookies.getCookie("username");
    },

    addResponseForm: function() {
      var responseFormView = new app.RequestResponseFormView({
        requestId: this.model.get("id")
      });
      this.$(".requestMain").append(
        requestFormView.render().el
      );
    },

    recordUpvote: function(e) {
      // Where should the screening for promptSignUp happen? here or in events?
      // I think i like here better.
      // this.model.incrementUpvotes();
    },

    recordResponseView: function(e) {
      // Where should the screening for promptSignUp happen? here or in events?
      // I think i like here better.
      // this.model.incrementResponseViews();
    }

  });

})();
