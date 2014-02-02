var app = app || {};

(function() {

  app.TrendingPublisherView = Backbone.View.extend({

    className: "trendingPublisher",

    render: function() {
      var publisherUsername = "<a class=\"trendingPublisherName\" href=\"/user/" + this.model.escape("username") + "\">" + this.model.escape("username") + "</a>";
      var publisherNumRequests = "<span class=\"badge\" data-toggle=\"tooltip\" title=\"" + this.model.get("receivedRequests").length + " requests\">" + this.model.get("receivedRequests").length + "</span>";

      this.$el.html(
        "<span class=\"glyphicon glyphicon-user\"></span>" +
        publisherUsername +
        publisherNumRequests
      );

      return this;
    }

  });

})();
