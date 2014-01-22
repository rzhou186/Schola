var app = app || {};

(function() {

  app.Request = Backbone.Model.extend({

    defaults: {
      id: null,
      name: "",
      url: "",
      upvotes: 0,
      status: 0,  // This should be a constant
      dateTime: null,
      openable: false
    },

    // Overwrite sync so it uses sockets, so that save works

    incrementUpvotes: function() {
      this.save({
        upvotes: this.get("upvotes") + 1
      });
    }

  });

})();
