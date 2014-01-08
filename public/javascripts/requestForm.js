var app = app || {};

$("#requestForm").submit(function(event) {

  event.preventDefault();
  $("#requestFormSubmit").addClass("disabled");
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#requestFormSubmit").removeClass("disabled");
      globalAlert("Empty request form field.");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["username"] = app.cookie.getCookie("username");
    data["password"] = app.cookie.getCookie("password");
    data["URL"] = "#";
    app.socket.emit('postRequest', data);

    app.socket.on('postRequestSuccess', function(response) {
    $("#requestFormSubmit").removeClass("disabled");
      switch(response.requestStatus) {
        case 1:
          // Request was successfully posted
          location.reload();
          break;
        case 2:
          globalAlert("Request could not be added.");
          app.socket.removeAllListeners('postRequestSuccess');
          break;
      }
    });
  }

});
