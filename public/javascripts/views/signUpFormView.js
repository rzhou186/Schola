(function () {

  app.SignUpFormView = Backbone.View.extend({

    el: "#logInForm",

    tagName: "form",

    events: {
      "click #signUpFormSubmit": "attemptSignUp"
    },

    enableFormSubmit: function() {
      this.$("#signUpFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$("#signUpFormSubmit").addClass("disabled");
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

    handleSignUpResp: function(resp, formData) {
      if (resp.signUpStatus === LOG_IN_SUCCESS) {
        app.cookies.setCookie("username", formData["username"]);
        app.cookies.setCookie("password", formData["password"]);
        location.reload();
      }
      else if (resp.signUpStatus === LOG_IN_FAILURE) {
        app.socket.removeAllListeners("signUpSuccess");
        app.alerter.alert("Sign up failed.");
      }
    },

    attemptSignUp: function() {
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData["password"] = app.crypto.encrypt(formData["password"]);
        app.socket.emit("signUp", formData);
        var that = this;
        app.socket.on("signUpSuccess", function(resp) {
          that.handleSignUpResp(resp, formData);
          that.enableFormSubmit();
        });
      }
    }

  });

})();