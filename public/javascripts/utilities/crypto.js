var app = app || {};

(function () {

  var Crypto = function() {};

  Crypto.prototype.encrypt = function(password) {
    return CryptoJS.SHA1(password).toString(CryptoJS.enc.hex);
  };

  app.crypto = new Crypto();

})();
