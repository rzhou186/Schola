$("#postForm").submit(function(event) {

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

  if (data) socket.emit('postPost', data);

});
