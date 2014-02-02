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
          that.enableFormSubmit();
          formData = null; return;
        }
        formData[formField.name] = formField.value;
      });
      return formData;
    },

    handleRecruitResp: function(resp, formData) {
      if (resp.submitStatus === app.RECRUIT_SUCCESS)
        location.reload();
        // this.$el.html(
        //   "<div class=\"title\">Welcome to Schola Publisher Network.</div>" + 
        //   "<p class=\"title\">We'll be in touch shortly.</p>"
        // );
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
