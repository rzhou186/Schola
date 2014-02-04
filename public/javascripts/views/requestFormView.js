var app = app || {};

(function() {

  app.RequestFormView = Backbone.View.extend({

    el: "#requestForm",

    events: {
      "submit": "postRequest"
    },

    initialize: function() {
      if (!app.viewerData["isLoggedIn"])
        this.$el.addClass("submitSignUp");
    },

    enableFormSubmit: function() {
      this.$("#requestFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$("#requestFormSubmit").addClass("disabled");
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
      formData["requesterUsername"] = app.cookies.getCookie("username");
      formData["publisherUsername"] = app.pageData["username"];
      formData["publisherFirstname"] = app.pageData["firstname"];
      formData["publisherLastname"] = app.pageData["lastname"];
      formData["password"] = app.cookies.getCookie("password");
      formData["responseURL"] = "#";
      formData["responseDescription"] = "";
      return formData;
    },

    handlePostResp: function(resp) {
      if (resp.requestStatus === app.POST_REQUEST_SUCCESS)
        location.reload();
      else if (resp.requestStatus === app.POST_REQUEST_FAILURE)
        app.alerter.alert("Post request failed.");
    },

    postRequest: function(e) {
      e.preventDefault();
      if (app.viewerData["isLoggedIn"]) {
        this.disableFormSubmit();
        var formData = this.extractFormData();
        if (formData) {
          formData = this.augmentFormData(formData);
          app.socket.emit("createRequest", formData);
          var that = this;
          app.socket.once("createRequestSuccess", function(resp) {
            that.handlePostResp(resp);
            that.enableFormSubmit();
          });
        }
      }
    }

  });

})();
