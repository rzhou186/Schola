var app = app || {};

(function() {

  app.Request = Backbone.Model.extend({

    initialize: function() {
      // Find a better location for these constants.
      this.REQUEST_NOT_SATISFIED = 0;
      this.REQUEST_SATISFIED = 1;
      this.INCREMENT_UPVOTES_FAILURE = 0;
      this.INCREMENT_UPVOTES_SUCCESS = 1;
      this.INCREMENT_RESPONSE_VIEWS_FAILURE = 0;
      this.INCREMENT_RESPONSE_VIEWS_SUCCESS = 1;
    },

    defaults: {
      id: null,
      name: "",
      upvotes: 0,
      status: this.REQUEST_NOT_SATISFIED,
      dateTime: null,
      requesterId: null,
      requesterName: "",
      satisfierId: null,
      satisfierName: "",
      responseUrl: "",
      responseDescription: "",
      responseViews: 0,
      responseDateTime: null,
      accessible: false
    },

    incrementUpvotes: function() {
      app.socket.emit("incrementUpVotes", {
        requestId: this.get("id"),
        username: app.cookies.getCookie("username"),
        password: app.cookies.getCookie("password")
      });

      var that = this;
      app.socket.once("incrementUpVotesSuccess", function(resp) {
        if (resp.requestId === that.get("id")) {
          if (resp.upvoteStatus === that.INCREMENT_UPVOTES_SUCCESS)
            that.set({ upvotes: that.get("upvotes") + 1 });
          else if (resp.upvoteStatus === that.INCREMENT_UPVOTES_FAILURE)
            app.alerter.alert("Record upvote failed.");
        }
      });
    },

    incrementResponseViews: function() {
      app.socket.emit("incrementViews", {
        requestId: this.get("id"),
        username: app.cookies.getCookie("username"),
        password: app.cookies.getCookie("password")
      });

      var that = this;
      app.socket.once("incrementViewsSuccess", function(resp) {
        // if (resp.requestId === that.get("id")) {
          if (resp.viewStatus === that.INCREMENT_RESPONSE_VIEWS_SUCCESS)
            that.set({ responseViews: that.get("responseViews") + 1 });
          else if (resp.viewStatus === that.INCREMENT_RESPONSE_VIEWS_FAILURE)
            app.alerter.alert("Record response view failed.");
        // }
      });
    }

  });

})();
