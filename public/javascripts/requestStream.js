var app = app || {};

$(document).ready(function() {
  positionRequestCol();
  $(window).resize(positionRequestCol);

  var data = {};
  data["start"] = 0;
  data["username"] = app.cookies.getCookie("username");
  data["password"] = app.cookies.getCookie("password");
  loadMoreRequests(data);

  var loadIfScrollBottom = function() {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
      $(".requestStreamLoading").show();
      loadMoreRequests(data);
    }
  };
  $("#requestStream").scroll(loadIfScrollBottom);

  app.socket.on('getRequestsSuccess', function(requestsData) {
    $(".requestStreamLoading").fadeOut("fast");
    $("#requestStream").scroll(loadIfScrollBottom);
    
    if (requestsData["result"].length > 0) {
      data["start"] += 10;                // Don't hardcode magic numbers...
      appendRequests(requestsData["result"], requestsData["isLoggedIn"]);
    }
    else $("#requestStream").off("scroll");
  });
});

function loadMoreRequests(data) {
  $("#requestStream").off("scroll");   // Unbind to prevent same load multiple times
  app.socket.emit('getRequests', data);
}

function appendRequests(requests, isLoggedIn) {
  for (var i=0; i<requests.length; i++) {
    var request = requests[i];
    var requestStatus = "<span class=\"glyphicon glyphicon-unchecked\"></span>";
    var requestName = request["name"];
    var requestDate = app.dateTime.formatDateTime(request["created"]);
    var requestUpvoteAccess = isLoggedIn ? "" : "promptSignUp"

    if (request["status"] === 1) {  // Request has been fulfilled
      requestStatus = "<span class=\"glyphicon glyphicon-ok\"></span>";
      if (isLoggedIn) {
        requestName = "<a href=\"" + request["URL"] + "\" target=\"_blank\">" +
          request["name"] + "</a>"  
      }
      else requestName = "<a class=\"promptSignUp\">" + request["name"] + "</a>"  
    }

    $("#requests").append(
      "<div class=\"request\" id=" + request["_id"] + ">" + 
        "<div class=\"requestMain\">" + 
          "<div class=\"requestTitle\">" + 
            "<span class=\"requestUsername\">anonymous </span>requested:" + 
          "</div>" + 
          "<div class=\"requestDate\">" + requestDate + "</div>" + 
          "<div class=\"requestName\">" +
            requestName +
          "</div>" + 
        "</div>" + 
        "<div class=\"requestSide\">" + 
          "<div class=\"requestStatus\">" +
            requestStatus + 
          "</div>" + 
          "<button class=\"upvoteRequest " + requestUpvoteAccess + 
            " btn btn-default btn-xs btn-block\">" + 
            "<span class=\"glyphicon glyphicon-chevron-up\"></span>" + 
            "<div class=\"requestUpvotes\">" + request["upvotes"] + "</div>" + 
          "</button>" + 
        "</div>" + 
      "</div>"
    );
  }
}

$(document).on("click", ".upvoteRequest:not(.promptSignUp)", function(e) {
  (function(){
    var request = $(e.target).closest(".request");
    var requestId = request.attr("id");
    var requestUpvotes = request.find(".requestUpvotes").html();
    var data = {
      requestId: requestId,
      username: app.cookies.getCookie("username"),
      password: app.cookies.getCookie("password")
    }

    app.socket.emit('incrementUpVotes', data);
    app.socket.on('incrementUpVotesSuccess', function(resp) {
      if (resp["requestId"] === requestId) {
        if (resp["upvoteStatus"] === 1) {
          requestUpvotes++;
          request.find(".requestUpvotes").html(requestUpvotes);
        }
        else app.alerter.alert("Upvote failed.");
      }
      app.socket.removeAllListeners('incrementUpVotesSuccess');
    });

  })();
});

// Move request divs off of fixed sidebar if window is too small
function positionRequestCol() {
  $("#alerts").empty();
  if ($(this).width() >= $(".fixedOverlay .container").width()) {
    // Move request divs to fixed sidebar
    if ($(".requestsCol").html()) {
      $(".requestsColFixed").html($(".requestsCol").html());
      $(".requestsCol").empty();
    }
  }
  else {
    // Move requests to relative sidebar
    if ($(".requestsColFixed").html()) {
      $(".requestsCol").html($(".requestsColFixed").html());
      $(".requestsColFixed").empty();
    }
  }
}