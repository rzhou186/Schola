$("#logInForm").submit(function(event) {

  event.preventDefault();
  $("#logInFormSubmit").addClass("disabled");
  var fields = $(this).serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#logInFormSubmit").removeClass("disabled");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["password"] = CryptoJS.SHA1(data["password"]).toString(CryptoJS.enc.hex);
    socket.emit('logIn', data);
  }

  socket.on('logInSuccess', function(response) {
    switch(response.logInStatus) {
      case 1:
        alert("Log in failed!");
        break;
      case 2:
        setCookie("username", data["username"]);
        setCookie("password", data["password"]);
        location.reload();
        break;
    }
  });

});
