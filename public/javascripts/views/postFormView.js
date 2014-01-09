var app = app || {};

(function() {

  app.PostFormView = Backbone.View.extend({

    el: "#postForm",

    events: {
      "submit": "attemptPostPost"
    },

    enableFormSubmit: function() {
      this.$("#postFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$("#postFormSubmit").addClass("disabled");
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
      formData["username"] = app.cookies.getCookie("username");
      formData["password"] = app.cookies.getCookie("password");
      return formData;
    },

    handlePostPostResp: function(resp, formData) {
      if (resp.postStatus === POST_POST_SUCCESS)
        location.reload();
      else if (resp.postStatus === POST_POST_FAILURE) {
        app.socket.removeAllListeners("postPostSuccess");
        app.alerter.alert("Post post failed.");
      }
    },

    attemptPostPost: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData = this.augmentFormData(formData);
        app.socket.emit("postPost", formData);
        var that = this;
        app.socket.on("postPostSuccess", function(resp) {
          that.handlePostPostResp(resp, formData);
          that.enableFormSubmit();
        });
      }
    }

  });

})();
