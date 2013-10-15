$(document).ready(function() {

  data = {};
  data["start"] = 0;

  loadMoreRequests(data);

  socket.on('getRequestsSuccess', function(requests) {
    data["start"] += 10;  // Don't hardcode magic numbers...
    appendRequests(requests["result"]);
    $(".requestStreamLoading").fadeOut("fast");
  });

  // When the user scrolls to the bottom, call loadMoreRequests

});

function loadMoreRequests(data) {
  $(".requestStreamLoading").show();
  socket.emit('getRequests', data);
}

function appendRequests(requests) {
  for (var i=0; i<requests.length; i++) {
    var request = requests[i];

    $("#requests").append(
      "<div class=\"request\">" + 
        "<div class=\"requestMain\">" + 
          "<div class=\"requestTitle\">" + 
            "<span class=\"requestUsername\">" + "anonymous" + " </span>requested:" + 
          "</div>" + 
          "<div class=\"requestDate\">" + "16 Apr" + "</div>" + 
          "<div class=\"requestName\">" +
            "<a href=\"" + request["URL"] + "\">" + request["name"] + "</a>" + 
          "</div>" + 
        "</div>" + 
        "<div class=\"requestSide\">" + 
          "<div class=\"requestStatus\">" +
            "<span class=\"glyphicon glyphicon-unchecked\"></span>" + 
          "</div>" + 
          "<button class=\"btn btn-default btn-xs btn-block\">" + 
            "<span class=\"glyphicon glyphicon-chevron-up\"></span>" + 
            "<div class=\"requestUpvotes\">" + request["upvotes"] + "</div>" + 
          "</button>" + 
        "</div>" + 
      "</div>"
    );

  }
}
