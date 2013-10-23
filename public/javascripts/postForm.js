$("#postForm").submit(function(event) {

  event.preventDefault();
  $("#postFormSubmit").addClass("disabled");
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#postFormSubmit").removeClass("disabled");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["username"] = getCookie("username");
    data["password"] = getCookie("password");
    socket.emit('postPost', data);
  }

  socket.on('postPostSuccess', function(response) {
    $("#postFormSubmit").removeClass("disabled");
    switch(response.postStatus) {
      case 1:
        // Post was successfully posted
        location.reload();
        break;
      case 2:
        alert("Add post failed!");
        break;
    }
  });

});
