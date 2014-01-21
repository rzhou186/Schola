var app = app || {};

(function() {

  app.Post = Backbone.Model.extend({

    defaults: {
      id: null,
      name: "",
      description: "",
      url: "",
      views: 0,
      dateTime: null,
      openable: false
    },

    // Overwrite sync so it uses sockets, so that save works

    incrementViews: function() {
      this.save({
        views: this.get("views") + 1
      });
    }

  });

})();
