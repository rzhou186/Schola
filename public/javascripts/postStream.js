$(document).ready(function() {

  data = {};
  data["start"] = 0;
  data["username"] = getCookie("username");
  data["password"] = getCookie("password");
  socket.emit('getPosts', data);

  socket.on('getPostsSuccess', function(postsData) {
    data["start"] += 10;  // Don't hardcode magic numbers...
    appendPosts(postsData["result"], postsData["isLoggedIn"]);
    $(".postStreamLoading").fadeOut("fast");
  });

  // When the user scrolls to the bottom, call loadMorePosts

  $("#postStream").tooltip({
    selector: "[data-toggle=\"tooltip\"]",
    placement: "left"
  });

});

function loadMorePosts(data) {
  $(".postStreamLoading").show();
  socket.emit('getPosts', data);
}

function appendPosts(posts, isLoggedIn) {
  for (var i=0; i<posts.length; i++) {
    (function(){

      var post = posts[i];
      socket.emit('getUserName', { posterId: post["posterId"], postId: post["_id"] });

      var postDate = formatDate(post["created"]);
      var postName = "<a class=\"promptSignup\">" + post["name"] + "</a>";
      var postGet = "<a class=\"promptSignup postGet btn btn-schola btn-xs\">View</a>"

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

      socket.on('getUserNameSuccess', function(data) {
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
  ".postName :not(.promptSignup), .postGet :not(.promptSignup)", function(e) {

  (function(){

    var post = $(e.target).closest(".post");
    var postId = post.attr("id");
    var postViews = post.find(".postViews").html();
    var data = {
      postId: postId
    }

    socket.emit('incrementViews', data);
    socket.on('incrementViewsSuccess', function(resp) {
      if (resp["postId"] === postId) {
        if (resp["viewStatus"] === 1) {
          postViews++;
          post.find(".postViews").html(postViews);
          post.find(".postViewsContainer").attr("title", postViews + " views");
        }
      }
      socket.removeAllListeners('incrementViewsSuccess');
    });

  })();
});