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
      app.alerter.alert("Empty request form field.");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["username"] = app.cookies.getCookie("username");
    data["password"] = app.cookies.getCookie("password");
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
          app.alerter.alert("Request could not be added.");
          app.socket.removeAllListeners('postRequestSuccess');
          break;
      }
    });
  }

});
