var app = app || {};

(function() {

  app.BodyView = Backbone.View.extend({

    el: "body",

    events: {
      "click .clickSignUp": "promptSignUp",
      "submit .submitSignUp": "promptSignUp"
    },

    initialize: function() {
      this.enableSidebarRepositioning();
      this.enableTooltips();

      // Initialize position of sidebar.
      this.repositionSidebarIfNeeded();
    },

    promptSignUp: function() {
      var message = "<strong>A username and password. </strong>" +
        "That's literally all we ask for. Sign up to unlock Schola.";
      app.alerter.remind(message);
    },

    hasRoomForFixedSidebar: function() {
      var fixedContainerWidth = this.$(".fixedOverlay .container").width();
      return $(window).width() >= fixedContainerWidth;
    },

    repositionSidebarIfNeeded: function() {
      app.alerter.clear();
      if (this.hasRoomForFixedSidebar()) {
        if (this.$("#sidebarRelative").html()) {
          this.$("#sidebarFixed").html(
            this.$("#sidebarRelative").html()
          );
          this.$("#sidebarRelative").empty();
        }
      }
      else {
        if (this.$("#sidebarFixed").html()) {
          this.$("#sidebarRelative").html(
            this.$("#sidebarFixed").html()
          );
          this.$("#sidebarFixed").empty();
        }
      }
    },

    enableSidebarRepositioning: function() {
      var that = this;
      $(window).on("resize", function() {
        that.repositionSidebarIfNeeded();
      });
    },

    enableTooltips: function() {
      this.$el.tooltip({
        selector: "[data-toggle=\"tooltip\"]",
        placement: "left"
      });
    }

  });

})();
