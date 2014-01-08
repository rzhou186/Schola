var app = app || {};

$("#logInForm").submit(function(event) {

  event.preventDefault();
  $("#logInFormSubmit").addClass("disabled");
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#logInFormSubmit").removeClass("disabled");
      globalAlert("Empty login form field.");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["password"] = CryptoJS.SHA1(data["password"]).toString(CryptoJS.enc.hex);
    app.socket.emit('logIn', data);
    
    app.socket.on('logInSuccess', function(response) {
      switch(response.logInStatus) {
        case 1:
          $("#logInFormSubmit").removeClass("disabled");
          app.socket.removeAllListeners('logInSuccess');
          globalAlert("Login failed.");
          break;
        case 2:
          app.cookie.setCookie("username", data["username"]);
          app.cookie.setCookie("password", data["password"]);
          location.reload();
          break;
      }
    });
  }

});
