$(document).ready(function() {

  data = {};
  data["start"] = 0;

  loadMorePosts(data);

  socket.on('getPostsSuccess', function(posts) {
    data["start"] += 10;  // Don't hardcode magic numbers...
    appendPosts(posts["result"]);
    $(".postStreamLoading").fadeOut("fast");
  });

  // When the user scrolls to the bottom, call loadMorePosts

});

function loadMorePosts(data) {
  $(".postStreamLoading").show();
  socket.emit('getPosts', data);
}

function appendPosts(posts) {
  for (var i=0; i<posts.length; i++) {
    var post = posts[i];

    $("#posts").append(
      "<div class=\"post\">" + 
        "<div class=\"postSide\">" + 
          "<div class=\"postTitle\">" + 
            "<span class=\"postUsername\">" + "testingdude" + " </span>" + 
            "added a post." + 
          "</div>" + 
          "<div class=\"postDate\">" + "22 Apr" + "</div>" + 
          "<div class=\"postViews\">" + post["views"] + 
            " <span class=\"glyphicon glyphicon-eye-open\"></span>" + 
          "</div>" + 
        "</div>" +
        "<div class=\"postMain\">" + 
          "<div class=\"postIcon\">" + 
            "<span class=\"glyphicon glyphicon-link\"></span>" + 
          "</div>" + 
          "<div class=\"postName\"><a href=\"" + post["URL"] + "\">" + post["name"] + "</a>" + 
          "</div>" + 
          "<div class=\"postDescription\">" + 
            "<p>" + post["desc"] + "</p>" + 
          "</div>" + 
          "<div class=\"postAccess\">" + 
            "<button class=\"postGet btn btn-schola btn-xs\">View</button>" + 
          "</div>" + 
        "</div>" + 
      "</div>"
    );

  }
}
