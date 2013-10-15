$(document).ready(function() {

  $(".requestStreamLoading").show();
  socket.emit('getRequests');

});

socket.on('getRequestsSuccess', function(data) {
  $(".requestStreamLoading").fadeOut("fast");
});