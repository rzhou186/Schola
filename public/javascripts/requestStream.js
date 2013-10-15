$(document).ready(function() {

  data = {};
  data["start"] = 0;
  $(".requestStreamLoading").show();
  socket.emit('getRequests', data);

});

socket.on('getRequestsSuccess', function(data) {
  $(".requestStreamLoading").fadeOut("fast");
});

function appendRequests(data) {

}
