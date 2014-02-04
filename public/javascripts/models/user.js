var app = app || {};

(function() {

  app.User = Backbone.Model.extend({

    defaults: {
      username: "",
      firstname: "",
      lastname: "",
      description: "",
      numReceivedRequests: 0
    }

  });

})();
