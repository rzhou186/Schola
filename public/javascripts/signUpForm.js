var app = app || {};

$("#signUpFormSubmit").click(function() {

  $("#signUpFormSubmit").addClass("disabled");
  var fields = $("#logInForm").serializeArray();

  var data = {};
  $.each(fields, function(i, field) {
    if (!field.value) {
      data = false;
      $("#signUpFormSubmit").removeClass("disabled");
      globalAlert("Empty signup form field.");
      return false;
    }
    data[field.name] = field.value;
  });

  if (data) {
    data["password"] = CryptoJS.SHA1(data["password"]).toString(CryptoJS.enc.hex);
    app.socket.emit('signUp', data);

    app.socket.on('signUpSuccess', function(response) {
      switch(response.signUpStatus) {
        case 1:
          $("#signUpFormSubmit").removeClass("disabled");
          app.socket.removeAllListeners('signUpSuccess');
          globalAlert("Signup failed.");
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
