var app = app || {};

(function() {

  app.PostStreamView = Backbone.View.extend({

    el: "#postStream",

    initialize: function() {
      this.initInfo();
      this.listenForLoads();
      this.enableScrollLoad();
      this.enableTooltips();

      // Load initial batch of posts.
      this.loadMorePosts();
    },

    initInfo: function() {
      this.info = {};
      this.info["oldLatest"] = 0;
      this.info["nextLatest"] = 0;
      this.info["nextMostViews"] = 0;
      this.info["username"] = app.cookies.getCookie("username");
      this.info["password"] = app.cookies.getCookie("password");
    },

    showStreamLoading: function() {
      this.$(".postStreamLoading").show();
    },

    hideStreamLoading: function() {
      this.$(".postStreamLoading").fadeOut("fast");
    },

    scrolledToBottom: function() {
      return $(window).scrollTop() + $(window).height() === $(document).height();
    },

    loadMorePosts: function() {
      this.disableScrollLoad();
      app.socket.emit("getPosts", this.info);
    },

    enableScrollLoad: function() {
      var that = this;
      $(window).on("scroll", function() {
        if (that.scrolledToBottom()) {
          that.showStreamLoading();
          that.loadMorePosts();
        }
      });
    },

    disableScrollLoad: function() {
      $(window).off("scroll");
    },

    updateInfo: function(postsData) {
      this.info["oldLatest"] = postsData["oldLatest"];
      this.info["nextLatest"] = postsData["nextLatest"];
      this.info["nextMostViews"] = postsData["nextMostViews"];
      this.info["isLoggedIn"] = postsData["isLoggedIn"];
    },

    buildPostModel: function(post) {
      return new app.Post({
        id: post["_id"],
        name: post["name"],
        description: post["desc"],
        url: post["URL"],
        views: post["views"],
        dateTime: post["created"],
        openable: this.info["isLoggedIn"]
      });
    },

    addPosts: function(posts) {
      for (var i=0; i<posts.length; i++) {
        var postModel = this.buildPostModel(posts[i]);
        var postView = new app.PostView({
          model: postModel
        });
        this.$("#posts").append(
          postView.render().el
        );
      }
    },

    listenForLoads: function() {
      var that = this;
      app.socket.on("getPostsSuccess", function(postsData) {
        that.hideStreamLoading();
        that.enableScrollLoad();
        var posts = postsData["result"];
        if (posts.length > 0) {
          that.updateInfo(postsData);
          that.addPosts(posts);
        }
        else that.disableScrollLoad();
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
