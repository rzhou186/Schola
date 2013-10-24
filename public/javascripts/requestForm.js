$("#requestForm").submit(function(event) {

  event.preventDefault();
  $("#requestFormSubmit").addClass("disabled");
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#requestFormSubmit").removeClass("disabled");
      alert("Empty form field!");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["username"] = getCookie("username");
    data["password"] = getCookie("password");
    data["URL"] = "#";
    socket.emit('postRequest', data);

    socket.on('postRequestSuccess', function(response) {
    $("#requestFormSubmit").removeClass("disabled");
      switch(response.requestStatus) {
        case 1:
          // Request was successfully posted
          location.reload();
          break;
        case 2:
          alert("Request failed!");
          socket.removeAllListeners('postRequestSuccess');
          break;
      }
    });
  }

});
