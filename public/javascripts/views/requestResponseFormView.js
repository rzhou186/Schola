var app = app || {};

(function() {

  app.RequestResponseFormView = Backbone.View.extend({

    tagName: "form",

    className: "requestResponseForm",

    events: {
      "click .isResource": "toggleResource",
      "submit": "postRequestResponse"
    },

    initialize: function(options) {
      // For data received from parent requestView.
      this.options = options || {};
    },

    render: function() {
      this.$el.html(
        "<div class=\"checkbox\">" +
          "Resource" +
          "<input type=\"checkbox\" class=\"isResource\" checked>" +
        "</div>" +
        "<p><strong>Answer Request</strong></p>" +
        "<input type=\"text\" name=\"responseURL\" maxlength=\"100\" placeholder=\"URL\" class=\"requestResponseFormUrl form-control\"/>" +
        "<textarea name=\"responseDescription\" rows=\"3\" placeholder=\"Description\" class=\"requestResponseFormDescription form-control\"></textarea>" +
        "<button type=\"submit\" class=\"requestResponseFormSubmit btn btn-schola btn-xs\">Submit</button>"
      );
      this.isResource = true;
      return this;
    },

    toggleResource: function() {
      this.isResource = !this.isResource;
      if (!this.isResource) {
        this.$(".requestResponseFormUrl").hide();
      }
      else {
        this.$(".requestResponseFormUrl").show();
      }
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
        // Returning non-false skips immediately to the next iteration.
        if (formField.name === "responseURL" && !that.isResource) return;

        if (!formField.value) {
          app.alerter.alert("Empty form field.");
          that.enableFormSubmit();
          formData = null; return false;
        }
        formData[formField.name] = formField.value;
      });
      return formData;
    },

    augmentFormData: function(formData) {
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
