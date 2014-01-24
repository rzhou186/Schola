var app = app || {};

(function() {

  app.RequestView = Backbone.View.extend({

    className: "request",

    events: {
      // "click .requestUpvotes": recordUpvote
      // "click .requestName": recordResponseView,
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    render: function() {
      var requestTitle = "<a class=\"satisfierName\" href=\"/user/" + this.model.get("satisfierName") + "\">" + this.model.get("satisfierName") + "</a> received a request.";
      var requestDateTime = app.dateTime.format(this.model.get("dateTime"));
      var requestViews = "";
      var requestUpvotes = this.model.get("upvotes");
      var requestName = this.model.get("name");
      var requestOrigin = "from <span class=\"requesterName\">" + this.model.get("requesterName") + "</span>";
      var responseDescription = "<em>This request is pending a response.</em>";

      if (this.model.get("status") === REQUEST_SATISFIED) {
        requestTitle = "<a class=\"satisfierName\" href=\"/user/" + this.model.get("satisfierName") + "\">" + this.model.get("satisfierName") + "</a> satisfied a request.";
        requestViews = "<div class=\"requestViews\" data-toggle=\"tooltip\" title=\"" + this.model.get("responseViews") + " views\">" + this.model.get("responseViews") + " <span class=\"glyphicon glyphicon-eye-open\"></span>" + "</div>";
        requestName = "<a href=\"" + this.model.get("responseUrl") + "\" target=\"_blank\">" + this.model.get("name") + "</a>";
        responseDescription = this.model.get("responseDescription");

        if (!this.model.get("openable"))
          requestName = "<a class=\"promptSignUp\">" + this.model.get("name") + "</a>";
      }

      this.$el.html(
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
            "<div>" +
              requestUpvotes + 
            "</div>" +
          "</button>" + 
          "<div class=\"requestName\">" + 
            requestName + 
          "</div>" +
          "<div class=\"requestOrigin\">" +
            requestOrigin + 
          "</div>" +
          "<div class=\"responseDescription\">" + 
            responseDescription +
          "</div>" +
        "</div>"
      );
      
      if (this.isOwnRequest() &&
          this.model.get("status") === REQUEST_NOT_SATISFIED)
        this.addResponseForm();

      return this;
    },

    isOwnRequest: function() {
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
