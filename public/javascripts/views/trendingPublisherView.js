var app = app || {};

(function() {

  app.TrendingPublisherView = Backbone.View.extend({

    className: "trendingPublisher",

    render: function() {
      var trendingPublisherUsername = "<a href=\"/user/" + this.model.escape("username") + "\">" + this.model.escape("username") + "</a>";
      console.log(this.model.get("receivedRequests"));

      this.$el.html(
        "<span class=\"glyphicon glyphicon-user\"></span>" +
        trendingPublisherUsername
      );

      return this;
    }

  });

})();
