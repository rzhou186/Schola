var app = app || {};

(function() {

  app.RequestResponseFormView = Backbone.View.extend({

    tagName: "form",

    className: "requestResponseForm",

    events: {
      "submit": "postRequestResponse"
    },

    initialize: function(options) {
      // For data received from parent requestView.
      this.options = options || {};
    },

    render: function() {
      this.$el.html(
        "<p><strong>Satisfy Request</strong></p>" +
        "<input type=\"text\" name=\"responseURL\" maxlength=\"100\" placeholder=\"Resource URL\" class=\"requestResponseFormName form-control\"/>" +
        "<textarea name=\"responseDescription\" rows=\"3\" placeholder=\"Resource Description\" class=\"requestResponseFormDescription form-control\"></textarea>" +
        "<button type=\"submit\" class=\"requestResponseFormSubmit btn btn-schola btn-xs\">Satisfy</button>"
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
      formData["requestId"] = this.options.requestId;
      formData["username"] = app.cookies.getCookie("username");
      formData["password"] = app.cookies.getCookie("password");
      return formData;
    },

    handlePostResp: function(resp) {
      if (resp.updateStatus === app.POST_REQUEST_RESPONSE_SUCCESS)
        location.reload();
      else if (resp.updateStatus === app.POST_REQUEST_RESPONSE_FAILURE)
        app.alerter.alert("Post request response failed.");
    },

    postRequestResponse: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        formData = this.augmentFormData(formData);
        app.socket.emit("updateRequest", formData);
        var that = this;
        app.socket.once("updateRequestSuccess", function(resp) {
          that.handlePostResp(resp);
          that.enableFormSubmit();
        });
      }
    }

  });

})();
