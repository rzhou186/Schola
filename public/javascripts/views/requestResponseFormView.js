var app = app || {};

(function() {

  app.RequestResponseFormView = Backbone.View.extend({

    events: {
      "submit": "postRequestResponse"
    },

    render: function() {
      this.$el.html(
        "<form class=\"requestResponseForm\">" +
          "<p><strong>Satisfy Request</strong></p>" +
          "<input type=\"text\" name=\"responseURL\" maxlength=\"100\" placeholder=\"Resource URL\" class=\"requestResponseFormName form-control\"/>" +
          "<textarea name=\"responseDescription\" rows=\"3\" placeholder=\"Resource Description\" class=\"requestResponseFormDescription form-control\"></textarea>" +
          "<button class=\"requestResponseFormSubmit\" type=\"submit\" class=\"btn btn-schola btn-xs\">Satisfy</button>" +
        "</form>"
      );
      return this;
    },

    enableFormSubmit: function() {
      this.$(".requestResponseFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$(".requestResponseFormSubmit").addClass("disabled");
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
      formData["requestId"] = this.requestId;
      formData["username"] = app.cookies.getCookie("username");
      formData["password"] = app.cookies.getCookie("password");
      return formData;
    },

    handlePostResp: function(resp, formData) {
      if (resp.requestStatus === POST_REQUEST_SUCCESS)
        location.reload();
      else if (resp.requestStatus === POST_REQUEST_FAILURE) {
        app.socket.removeAllListeners("updateRequestSuccess");
        app.alerter.alert("Post request response failed.");
      }
    },

    postRequestResponse: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData = this.augmentFormData(formData);
        app.socket.emit("updateRequest", formData);
        var that = this;
        app.socket.on("updateRequestSuccess", function(resp) {
          that.handlePostResp(resp, formData);
          that.enableFormSubmit();
        });
      }
    }

  });

})();