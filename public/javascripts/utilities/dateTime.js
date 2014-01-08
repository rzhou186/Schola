var app = app || {};

(function () {

  var DateTime = function() {};

  DateTime.prototype.formatDateTime = function(rawDateTime) {
    var monthAbbrev = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"
    ];
    var date = new Date(rawDateTime);
    var dateDay = date.getDate();
    var dateMonth = date.getMonth();
    var dateMonthAbbrev = monthAbbrev[dateMonth];
    return dateDay + " " + dateMonth;
  }

  app.dateTime = new DateTime();

})();
