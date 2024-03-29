var app = app || {};

(function() {

  app.LogInFormView = Backbone.View.extend({

    el: "#logInForm",

    events: {
      "submit": "logIn"
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
          formData = null; return false;
        }
        formData[formField.name] = formField.value;
      });
      return formData;
    },

    augmentFormData: function(formData){
      formData["password"] = app.crypto.encrypt(formData["password"]);
      return formData;
    },

    handleLogInResp: function(resp, formData) {
      if (resp.logInStatus === app.LOG_IN_SUCCESS) {
        app.cookies.setCookie("username", formData["username"]);
        app.cookies.setCookie("password", formData["password"]);
        location.reload();
      }
      else if (resp.logInStatus === app.LOG_IN_FAILURE)
        app.alerter.alert("Log in failed.");
    },

    logIn: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData = this.augmentFormData(formData);
        app.socket.emit("logIn", formData);
        var that = this;
        app.socket.once("logInSuccess", function(resp) {
          that.handleLogInResp(resp, formData);
          that.enableFormSubmit();
        });
      }
    }

  });

})();
