$("#signUpFormSubmit").click(function() {

  var fields = $("#logInForm").serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["password"] = CryptoJS.SHA1(data["password"]).toString(CryptoJS.enc.hex);
    socket.emit('signUp', data);
  }

  socket.on('signUpSuccess', function(response) {
    switch(response.signUpStatus) {
      case 1:
        alert("Sign up failed!");
        break;
      case 2:
        setCookie("username", data["username"]);
        setCookie("password", data["password"]);
        location.reload();
    }
  });

});
