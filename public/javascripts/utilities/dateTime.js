var app = app || {};

(function() {

  var DateTime = function() {};

  DateTime.prototype.format = function(rawDateTime) {
    var monthAbbrevs = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"
    ];
    var date = new Date(rawDateTime);
    var day = date.getDate();
    var month = date.getMonth();
    var monthAbbrev = monthAbbrevs[month];
    return day + " " + monthAbbrev;
  }

  app.dateTime = new DateTime();

})();
