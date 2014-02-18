var app = app || {};

(function() {

  app.LaunchFormView = Backbone.View.extend({

    el: "#launchForm",

    events: {
      "submit": "submitEmail"
    },

    enableFormSubmit: function() {
      this.$("#launchFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$("#launchFormSubmit").addClass("disabled");
    },

    extractFormData: function() {
      var formFields = this.$el.serializeArray();
      var formData = {};
      var that = this;
      $.each(formFields, function(i, formField) {
        if (!formField.value) {
          that.enableFormSubmit();
          formData = null; return false;
        }
        formData[formField.name] = formField.value;
      });
      return formData;
    },

    handleSubmitEmailResp: function(resp, formData) {
      if (resp.submitStatus === app.SUBMIT_EMAIL_SUCCESS) {
        var that = this;
        this.$(".content").fadeOut("slow", function() {
          that.$(".content").html(
            "<div class=\"title text-center\">" + 
              "Thank you for requesting an invite." +
            "</div>" + 
            "<p class=\"text-center\">You'll be hearing from us shortly.</p>"
          ).fadeIn("slow");
        });
      }
      else if (resp.submitStatus === app.SUBMIT_EMAIL_FAILURE)
        this.enableFormSubmit();
    },

    submitEmail: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        app.socket.emit("submitEmail", formData);
        var that = this;
        app.socket.once("submitEmailSuccess", function(resp) {
          that.handleSubmitEmailResp(resp, formData);
        });
      }
    }

  });

})();
