var app = app || {};

(function() {

  app.RequestStreamView = Backbone.View.extend({

    el: "#requestStream",

    initialize: function() {
      this.initInfo();
      this.listenForLoads();
      this.enableScrollLoad();
      this.enableTooltips();

      // Load initial batch of requests.
      this.loadMoreRequests();
    },

    initInfo: function() {
      this.info = {};
      this.info["start"] = 0;
      this.info["username"] = app.cookies.getCookie("username");
      this.info["password"] = app.cookies.getCookie("password");
    },

    showStreamLoading: function() {
      this.$("#requestStreamLoading").show();
    },

    hideStreamLoading: function() {
      this.$("#requestStreamLoading").fadeOut("fast");
    },

    scrolledToBottom: function() {
      return $(window).scrollTop() + $(window).height() === $(document).height();
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
      this.info["start"] += REQUESTS_PER_LOAD;
      this.info["isLoggedIn"] = requestsData["isLoggedIn"];
    },

    buildRequestModel: function(request) {
      return new app.Request({
        id: request["_id"],
        name: request["name"],
        upvotes: request["views"],
        status: request["status"],
        dateTime: request["created"],
        requesterId: request["requesterId"],
        requesterName: request["requesterName"],
        satisfierId: request["satisfierId"],
        satisfierName: request["satisfierName"],
        reponseUrl: request["responseURL"],
        reponseDescription: request["responseDescription"],
        responseViews: request["responseViews"],
        responseDateTime: request["responseDate"],
        openable: this.info["isLoggedIn"]
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
    },

    enableTooltips: function() {
      this.$el.tooltip({
        selector: "[data-toggle=\"tooltip\"]",
        placement: "left"
      });
    }

  });

})();
