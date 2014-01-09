var app = app || {};

$("#postForm").submit(function(event) {

  event.preventDefault();
  $("#postFormSubmit").addClass("disabled");
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#postFormSubmit").removeClass("disabled");
      app.alerter.alert("Empty post form field.");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["username"] = app.cookies.getCookie("username");
    data["password"] = app.cookies.getCookie("password");
    app.socket.emit('postPost', data);
    
    app.socket.on('postPostSuccess', function(response) {
      $("#postFormSubmit").removeClass("disabled");
      switch(response.postStatus) {
        case 1:
          // Post was successfully posted
          location.reload();
          break;
        case 2:
          app.alerter.alert("Post could not be added.");
          app.socket.removeAllListeners('postPostSuccess');
          break;
      }
    });
  }

});
