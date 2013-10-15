$(document).ready(function() {

  $(".postStreamLoading").show();
  socket.emit('getPosts');

});

socket.on('getPostsSuccess', function(data) {
  $(".postStreamLoading").fadeOut("fast");
});
