var app = app || {};

var LOG_IN_FAILURE = 1;
var LOG_IN_SUCCESS = 2;

var SIGN_UP_FAILURE = 1;
var SIGN_UP_SUCCESS = 2;

var REQUEST_NOT_SATISFIED = 0;
var REQUEST_SATISFIED = 1;

var REQUESTS_PER_LOAD = 10;

(function () {

  new app.BodyView();
  new app.NavbarView();
  new app.RequestStreamView();

})();
