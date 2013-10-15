$(document).ready(function() {

  data = {};
  data["start"] = 0;
  $(".postStreamLoading").show();
  socket.emit('getPosts', data);

});

socket.on('getPostsSuccess', function(data) {
  $(".postStreamLoading").fadeOut("fast");
});

function appendPosts(data) {

}
