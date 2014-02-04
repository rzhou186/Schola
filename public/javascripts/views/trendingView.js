var app = app || {};

(function() {

  app.TrendingView = Backbone.View.extend({

    el: "#trending",

    initialize: function() {
      this.listenForLoads();
      this.loadTrendingPublishers();
    },

    buildUserModel: function(user) {
      return new app.User({
        username: user["username"],
        numReceivedRequests: user["numReceivedRequests"]
      });
    },

    addTrendingPublishers: function(users) {
      for (var i=0; i<users.length; i++) {
        var userModel = this.buildUserModel(users[i]);
        var trendingPublisherView = new app.TrendingPublisherView({
          model: userModel
        });
        this.$("#trendingPublishers").append(
          trendingPublisherView.render().el
        );
      }
    },

    listenForLoads: function() {
      var that = this;
      app.socket.on("getTrendingPublishersSuccess", function(publishersData) {
        var users = publishersData["result"];
        that.addTrendingPublishers(users);
      });
    },

    loadTrendingPublishers: function() {
      app.socket.emit("getTrendingPublishers");
    }

  });

})();
