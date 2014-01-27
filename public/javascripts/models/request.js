var app = app || {};

(function() {

  app.Request = Backbone.Model.extend({

    initialize: function() {
      // Find a better location for these constants.
      this.REQUEST_NOT_SATISFIED = 0;
      this.REQUEST_SATISFIED = 1;
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

    // Overwrite sync so it uses sockets, so that save works

    incrementUpvotes: function() {
      // this.save({
      //   upvotes: this.get("upvotes") + 1
      // });
    },

    incrementResponseViews: function() {
      // this.save({
      //   responseViews: this.get("responseViews") + 1
      // });
    }

  });

})();
