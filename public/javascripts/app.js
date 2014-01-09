var app = app || {};

var LOG_IN_SUCCESS = 2;
var LOG_IN_FAILURE = 1;

var SIGN_UP_SUCCESS = 2;
var SIGN_UP_FAILURE = 1;

var POST_POST_SUCCESS = 1;
var POST_POST_FAILURE = 2;

var POST_REQUEST_SUCCESS = 1;
var POST_REQUEST_FAILURE = 2;

(function () {

  new app.BodyView();
  new app.LogInFormView();
  new app.SignUpFormView();
  new app.LogOutView();
  new app.PostFormView();
  new app.RequestFormView();

})();
