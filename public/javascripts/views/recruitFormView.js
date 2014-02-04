var app = app || {};

(function() {

  app.RecruitFormView = Backbone.View.extend({

    el: "#recruitForm",

    events: {
      "submit": "recruit"
    },

    enableFormSubmit: function() {
      this.$("#recruitFormSubmit").removeClass("disabled");
    },

    disableFormSubmit: function() {
      this.$("#recruitFormSubmit").addClass("disabled");
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

    handleRecruitResp: function(resp, formData) {
      if (resp.submitStatus === app.RECRUIT_SUCCESS) {
        var that = this;
        this.$el.fadeOut("slow", function() {
          that.$el.html(
            "<div class=\"title\">" + 
              "Thank you for applying to " + 
              "<div><strong>Schola Publisher Network</strong>.</div>" +
            "</div>" + 
            "<p class=\"closing\">We'll be getting in touch shortly.</p>"
          ).fadeIn("slow");
        });
      }
      else if (resp.submitStatus === app.RECRUIT_FAILURE)
        app.alerter.alert("Submit email failed.");
    },

    recruit: function(e) {
      e.preventDefault();
      this.disableFormSubmit();
      var formData = this.extractFormData();
      if (formData) {
        app.socket.emit("submitEmail", formData);
        var that = this;
        app.socket.once("submitEmailSuccess", function(resp) {
          that.handleRecruitResp(resp, formData);
          that.enableFormSubmit();
        });
      }
    }

  });

})();
