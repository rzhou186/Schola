(function () {

  app.LogInFormView = Backbone.View.extend({

    el: "#logInForm",

    tagName: "form",

    events: {
      "submit": "attemptLogIn"
    },

    enableFormSubmit: function() {
      this.$("#logInFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$("#logInFormSubmit").addClass("disabled");
    },

    extractFormData: function() {
      var formFields = this.$el.serializeArray();
      var formData = {};
      var that = this;
      $.each(formFields, function(i, formField) {
        if (!formField.value) {
          app.alerter.alert("Empty form field.");
          that.enableFormSubmit();
          formData = null; return;
        }
        formData[formField.name] = formField.value;
      });
      return formData;
    },

    handleLogInResp: function(resp, formData) {
      if (resp.logInStatus === LOG_IN_SUCCESS) {
        app.cookies.setCookie("username", formData["username"]);
        app.cookies.setCookie("password", formData["password"]);
        location.reload();
      }
      else if (resp.logInStatus === LOG_IN_FAILURE) {
        app.socket.removeAllListeners("logInSuccess");
        app.alerter.alert("Log in failed.");
      }
    },

    attemptLogIn: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData["password"] = app.crypto.encrypt(formData["password"]);
        app.socket.emit("logIn", formData);
        var that = this;
        app.socket.on("logInSuccess", function(resp) {
          that.handleLogInResp(resp, formData);
          that.enableFormSubmit();
        });
      }
    }

  });

})();