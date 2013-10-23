$(document).ready(function() {

  data = {};
  data["start"] = 0;
  socket.emit('getRequests', data);

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
    var requestStatus = "<span class=\"glyphicon glyphicon-unchecked\"></span>";
    var requestName = request["name"];
    console.log(request);

    if (request["status"] === 1) {  // Request has been fulfilled
      requestStatus = "<span class=\"glyphicon glyphicon-ok\"></span>";
      requestName = "<a href=\"" + request["URL"] + "\" target=\"_blank\">" +
        request["name"] +
        "</a>"
    }

    $("#requests").append(
      "<div class=\"request\" id=" + request["_id"] + ">" + 
        "<div class=\"requestMain\">" + 
          "<div class=\"requestTitle\">" + 
            "<span class=\"requestUsername\">anonymous </span>requested:" + 
          "</div>" + 
          "<div class=\"requestDate\">" + "16 Apr" + "</div>" + 
          "<div class=\"requestName\">" +
            requestName +
          "</div>" + 
        "</div>" + 
        "<div class=\"requestSide\">" + 
          "<div class=\"requestStatus\">" +
            requestStatus + 
          "</div>" + 
          "<button class=\"upvoteRequest btn btn-default btn-xs btn-block\">" + 
            "<span class=\"glyphicon glyphicon-chevron-up\"></span>" + 
            "<div class=\"requestUpvotes\">" + request["upvotes"] + "</div>" + 
          "</button>" + 
        "</div>" + 
      "</div>"
    );
  }
}

$(document).on("click", ".upvoteRequest", function(e) {
  (function(){

    var request = $(e.target).closest(".request");
    var requestId = request.attr("id");
    var requestUpvotes = request.find(".requestUpvotes").html();
    var data = {
      requestId: requestId,
      username: getCookie("username"),
      password: getCookie("password")
    }

    socket.emit('incrementUpVotes', data);
    socket.on('incrementUpVotesSuccess', function(resp) {
      if (resp["requestId"] === requestId) {
        if (resp["upvoteStatus"] === 1) {
          requestUpvotes++;
          request.find(".requestUpvotes").html(requestUpvotes);
        }
        else alert("Upvote failed!");
      }
      socket.removeAllListeners('incrementUpVotesSuccess');
    });

  })();
});
