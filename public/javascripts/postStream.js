var app = app || {};

$(document).ready(function() {
  var data = {};
  data["oldLatest"] = 0;
  data["nextLatest"] = 0;
  data["nextMostViews"] = 0;
  data["username"] = app.cookies.getCookie("username");
  data["password"] = app.cookies.getCookie("password");
  loadMorePosts(data);

  var loadIfScrollBottom = function() {
    if ($(this).scrollTop() + $(this).height() == $(document).height()) {
      $(".postStreamLoading").show();
      loadMorePosts(data);
    }
  }
  $(window).scroll(loadIfScrollBottom);  

  app.socket.on('getPostsSuccess', function(postsData) {
    $(".postStreamLoading").fadeOut("fast");
    $(window).scroll(loadIfScrollBottom);    

    if (postsData["result"].length > 0) {
      data["oldLatest"] = postsData["oldLatest"];
      data["nextLatest"] = postsData["nextLatest"];
      data["nextMostViews"] = postsData["nextMostViews"];
      // data["start"] += 10;                // Don't hardcode magic numbers...
      appendPosts(postsData["result"], postsData["isLoggedIn"]);
    }
    else $(window).off("scroll");
  });

  $("#postStream").tooltip({
    selector: "[data-toggle=\"tooltip\"]",
    placement: "left"
  });  
});

function loadMorePosts(data) {
  $(window).off("scroll");      // Unbind to prevent same load multiple times
  app.socket.emit('getPosts', data);
}

function appendPosts(posts, isLoggedIn) {
  for (var i=0; i<posts.length; i++) {
    (function(){
      var post = posts[i];
      app.socket.emit('getUserName', { posterId: post["posterId"], postId: post["_id"] });

      var postDate = app.dateTime.format(post["created"]);
      var postName = "<a class=\"promptSignUp\">" + post["name"] + "</a>";
      var postGet = "<a class=\"promptSignUp postGet btn btn-schola btn-xs\">View</a>"

      if (isLoggedIn) {
        postName = "<a href=\"" + post["URL"] + "\" target=\"_blank\">"
          + post["name"] + "</a>";
        postGet = "<a class=\"btn btn-schola btn-xs\" target=\"_blank\" href=\"" + 
          post["URL"] + "\">View</a>"
      }

      $("#posts").append(
        "<div class=\"post\" id=" + post["_id"] + ">" + 
          "<div class=\"postSide\">" + 
            "<div class=\"postTitle\">" + 
              "<span class=\"postUsername\"></span>" + 
              "added a post." + 
            "</div>" + 
            "<div class=\"postDate\">" + postDate + "</div>" + 
            "<div class=\"postViewsContainer\" data-toggle=\"tooltip\" title=\"" + 
              post["views"] + " views\">" + 
              "<span class=\"postViews\">" + post["views"] + "</span>" +
              " <span class=\"glyphicon glyphicon-eye-open\"></span>" + 
            "</div>" + 
          "</div>" +
          "<div class=\"postMain\">" + 
            "<div class=\"postIcon\" data-toggle=\"tooltip\" title=\"Link\">" + 
              "<span class=\"glyphicon glyphicon-link\"></span>" + 
            "</div>" + 
            "<div class=\"postName\">" + postName + "</div>" + 
            "<div class=\"postDescription\">" + 
              "<p>" + post["desc"] + "</p>" + 
            "</div>" + 
            "<div class=\"postGet\">" + postGet + "</div>" + 
          "</div>" + 
        "</div>"
      );

      app.socket.on('getUserNameSuccess', function(data) {
        if (data["postId"] === post["_id"]) {
          if (data["getUserNameStatus"] === 1) {
            $(".post#" + post["_id"]).find(".postUsername")
              .html(data["result"] + " ");
          }
        }
      });
    })();
  }
}

$(document).on("click", 
  ".postName :not(.promptSignUp), .postGet :not(.promptSignUp)", function(e) {
  (function(){
    var post = $(e.target).closest(".post");
    var postId = post.attr("id");
    var postViews = post.find(".postViews").html();
    var data = {
      postId: postId
    }

    app.socket.emit('incrementViews', data);
    app.socket.on('incrementViewsSuccess', function(resp) {
      if (resp["postId"] === postId) {
        if (resp["viewStatus"] === 1) {
          postViews++;
          post.find(".postViews").html(postViews);
          post.find(".postViewsContainer").attr("title", postViews + " views");
        }
      }
      app.socket.removeAllListeners('incrementViewsSuccess');
    });
  })();
});