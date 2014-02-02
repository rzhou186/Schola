var app = app || {};

(function() {

  app.User = Backbone.Model.extend({

    defaults: {
      username: "",
      description: "",
      receivedRequests: []
    }

  });

})();
