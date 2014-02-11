var app = app || {};

(function() {

  app.RequestStreamView = Backbone.View.extend({

    el: "#requestStream",

    initialize: function() {
      this.initInfo();
      this.listenForLoads();
      this.enableScrollLoad();

      // Load initial batch of requests.
      this.loadMoreRequests();
    },

    isViewingUserPage: function() {
      if (app.pageData) return true;
      return false;
    },

    initInfo: function() {
      this.info = {};
      this.info["start"] = 0;
      this.info["username"] = app.cookies.getCookie("username");
      this.info["password"] = app.cookies.getCookie("password");
      if (this.isViewingUserPage())
        this.info["publisherUsername"] = app.pageData.username;
      else this.info["publisherUsername"] = "";
    },

    showStreamLoading: function() {
      this.$("#requestStreamLoading").show();
    },

    hideStreamLoading: function() {
      this.$("#requestStreamLoading").fadeOut("fast");
    },

    scrolledToBottom: function() {
      return $(window).scrollTop() + $(window).height() >= $(document).height() - 300;
    },

    loadMoreRequests: function() {
      this.disableScrollLoad();
      app.socket.emit("getRequests", this.info);
    },

    enableScrollLoad: function() {
      var that = this;
      $(window).on("scroll", function() {
        if (that.scrolledToBottom()) {
          that.showStreamLoading();
          that.loadMoreRequests();
        }
      });
    },

    disableScrollLoad: function() {
      $(window).off("scroll");
    },

    updateInfo: function(requestsData) {
      this.info["start"] += app.REQUESTS_PER_LOAD;
    },

    buildRequestModel: function(request) {
      return new app.Request({
        id: request["_id"],
        name: request["name"],
        upvotes: request["upvotes"],
        status: request["status"],
        dateTime: request["created"],
        requesterId: request["requesterId"],
        requesterUsername: request["requesterUsername"],
        publisherId: request["publisherId"],
        publisherUsername: request["publisherUsername"],
        publisherFirstname: request["publisherFirstname"],
        publisherLastname: request["publisherLastname"],
        responseUrl: request["responseURL"],
        responseDescription: request["responseDescription"],
        responseViews: request["responseViews"],
        responseDateTime: request["responseDate"],
        upvotingDisabled: request["disabled"],
        accessible: app.viewerData["isLoggedIn"]
      });
    },

    addRequests: function(requests) {
      for (var i=0; i<requests.length; i++) {
        var requestModel = this.buildRequestModel(requests[i]);
        var requestView = new app.RequestView({
          model: requestModel
        });
        this.$("#requests").append(
          requestView.render().el
        );
      }
    },

    listenForLoads: function() {
      var that = this;
      app.socket.on("getRequestsSuccess", function(requestsData) {
        that.hideStreamLoading();
        that.enableScrollLoad();
        var requests = requestsData["result"];
        if (requests.length) {
          that.updateInfo(requestsData);
          that.addRequests(requests);
        }
        else that.disableScrollLoad();
      });
    }

  });

})();
