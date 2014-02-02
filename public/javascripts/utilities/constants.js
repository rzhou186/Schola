var app = app || {};

(function() {

  app.LOG_IN_FAILURE = 1;
  app.LOG_IN_SUCCESS = 2;

  app.SIGN_UP_FAILURE = 1;
  app.SIGN_UP_SUCCESS = 2;

  app.POST_REQUEST_RESPONSE_FAILURE = 0;
  app.POST_REQUEST_RESPONSE_SUCCESS = 1;

  app.REQUEST_NOT_ANSWERED = 0;
  app.REQUEST_ANSWERED = 1;

  app.REQUESTS_PER_LOAD = 10;

  app.INCREMENT_UPVOTES_FAILURE = 0;
  app.INCREMENT_UPVOTES_SUCCESS = 1;
  
  app.INCREMENT_RESPONSE_VIEWS_FAILURE = 0;
  app.INCREMENT_RESPONSE_VIEWS_SUCCESS = 1;

  app.DELETE_REQUEST_FAILURE = 0;
  app.DELETE_REQUEST_SUCCESS = 1;

  app.POST_REQUEST_FAILURE = 2;
  app.POST_REQUEST_SUCCESS = 1;

  app.RECRUIT_FAILURE = 0;
  app.RECRUIT_SUCCESS = 1;

})();