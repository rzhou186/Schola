(function () {

  app.LogOutView = Backbone.View.extend({

    el: "#logOut",

    events: {
      "click": "logOut"
    },

    logOut: function(e) {
      e.preventDefault();
      app.cookies.deleteCookie("username");
      app.cookies.deleteCookie("password");
      location.reload();
    }

  });

})();