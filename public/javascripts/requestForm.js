$("#requestForm").submit(function(event) {

  event.preventDefault();
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["username"] = getCookie("username");
    data["password"] = getCookie("password");
    data["URL"] = "#";
    socket.emit('postRequest', data);
  }

  socket.on('postRequestSuccess', function(response) {
    switch(response.requestStatus) {
      case 1:
        // Request was successfully posted
        break;
      case 2:
        alert("Add request failed!");
        break;
    }
  });

});
