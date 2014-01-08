var app = app || {};

(function () {

  var Cookie = function() {};

  Cookie.prototype.setCookie = function(name, value, expires) {
    var cookie = name + "=" + escape(value) + ";";
    if (expires) {
      if (expires instanceof Date) {
        if (isNaN(expires.getTime()))
          expires = new Date();
      }
      else expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
      cookie += "expires=" + expires.toGMTString() + ";";
    }
    document.cookie = cookie;
  };

  Cookie.prototype.getCookie = function(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2)
      return parts.pop().split(";").shift();
  };

  Cookie.prototype.deleteCookie = function(name) {
    this.setCookie(name, "", -1);
  };

  app.cookie = new Cookie();

})();
