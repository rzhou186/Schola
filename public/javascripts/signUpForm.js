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

});

socket.on('', function(data) {
  
});