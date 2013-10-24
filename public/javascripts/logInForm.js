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
    socket.emit('logIn', data);
    
    socket.on('logInSuccess', function(response) {
      switch(response.logInStatus) {
        case 1:
          $("#logInFormSubmit").removeClass("disabled");
          socket.removeAllListeners('logInSuccess');
          globalAlert("Login failed.");
          break;
        case 2:
          setCookie("username", data["username"]);
          setCookie("password", data["password"]);
          location.reload();
          break;
      }
    });
  }

});
