function formatDate(dateString) {

  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
  ]

  var date = new Date(dateString);
  var dateMonth = monthNames[date.getMonth()];
  var dateDay = date.getDate().toString();

  return dateDay + " " + dateMonth;
}