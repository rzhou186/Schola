var app = app || {};

(function() {

  app.BodyView = Backbone.View.extend({

    el: "body",

    events: {
      "click .promptSignUp": "promptSignUp"
    },

    initialize: function() {
      this.enableSidebarRepositioning();

      // Decide initial position of sidebar.
      this.repositionSidebarIfAble();
    },

    promptSignUp: function() {
      this.$("#alerts").empty();
      this.$("#alerts").prepend(
        "<div class=\"alert alert-success\">" +
          "<button type=\"button\" class=\"close\"" +
            "data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
          "<strong>A username and password. </strong>" +
          "That's all we ask for. Sign up and unlock Schola." +
        "</div>"
      );
    },

    hasRoomForFixedSidebar: function()  {
      var fixedContainerWidth = this.$(".fixedOverlay .container").width();
      return $(window).width() >= fixedContainerWidth;
    },

    repositionSidebarIfAble: function() {
      app.alerter.clear();
      if (this.hasRoomForFixedSidebar()) {
        if (this.$("#sidebarRelative").html()) {
          this.$("#sidebarFixed").html(this.$("#sidebarRelative").html());
          this.$("#sidebarRelative").empty();
        }
      }
      else {
        if (this.$("#sidebarFixed").html()) {
          this.$("#sidebarRelative").html(this.$("#sidebarFixed").html());
          this.$("#sidebarFixed").empty();
        }
      }
    },

    enableSidebarRepositioning: function() {
      var that = this;
      $(window).on("resize", function() {
        that.repositionSidebarIfAble();
      });
    }

  });

})();
