var app = app || {};

(function() {

  app.Request = Backbone.Model.extend({

    initialize: function() {
      this.REQUEST_NOT_SATISFIED = 0;
      this.REQUEST_SATISFIED = 1;
    }

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
      reponseUrl: "",
      reponseDescription: "",
      responseViews: 0,
      responseDateTime: null,
      openable: false
    },

    // Overwrite sync so it uses sockets, so that save works

    incrementViews: function() {

    }

    incrementUpvotes: function() {
      // this.save({
      //   upvotes: this.get("upvotes") + 1
      // });
    }

  });

})();
