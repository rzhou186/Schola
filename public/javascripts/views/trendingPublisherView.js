var app = app || {};

(function() {

  app.TrendingPublisherView = Backbone.View.extend({

    className: "trendingPublisher",

    render: function() {
      var publisherUsername = "<a class=\"trendingPublisherName\" href=\"/user/" + this.model.escape("username") + "\">" + this.model.escape("firstname") + " " + this.model.escape("lastname") + "</a>";
      var publisherNumRequests = "<span class=\"badge\">" + this.model.get("numReceivedRequests") + "</span>";

      this.$el.html(
        "<span class=\"glyphicon glyphicon-user\"></span>" +
        publisherUsername +
        publisherNumRequests
      );

      return this;
    }

  });

})();
