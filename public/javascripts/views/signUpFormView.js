var app = app || {};

(function() {

  app.SignUpFormView = Backbone.View.extend({

    el: "#logInForm",

    events: {
      "click #signUpFormSubmit": "signUp"
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

    augmentFormData: function(formData){
      formData["password"] = app.crypto.encrypt(formData["password"]);
      return formData;
    },

    handleSignUpResp: function(resp, formData) {
      if (resp.signUpStatus === SIGN_UP_SUCCESS) {
        app.cookies.setCookie("username", formData["username"]);
        app.cookies.setCookie("password", formData["password"]);
        location.reload();
      }
      else if (resp.signUpStatus === SIGN_UP_FAILURE) {
        app.socket.removeAllListeners("signUpSuccess");
        app.alerter.alert("Sign up failed.");
      }
    },

    signUp: function() {
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData = this.augmentFormData(formData);
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
