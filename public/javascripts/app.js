var app = app || {};

var LOG_IN_FAILURE = 1;
var LOG_IN_SUCCESS = 2;

var SIGN_UP_FAILURE = 1;
var SIGN_UP_SUCCESS = 2;

(function () {

  new app.LogInFormView();
  new app.SignUpFormView();
  new app.LogOutView();

})();