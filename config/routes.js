//#######__MODULE DEPENDENCIES__#########
var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	pageController 			= require('../app/controllers/pageController')
	var requestsController 		= require('../app/controllers/requestsController')
	var recruitEmailSignUpController	= require('../app/controllers/recruitEmailSignUpController')
	var sideBarController				= require('../app/controllers/sideBarController')
	var newUserController				= require('../app/controllers/newUserController')
	var cronController 					= require('../app/controllers/cronController')
	//more can come here
	app.get('/', pageController.index);
	app.get('/recruit', pageController.recruit);
	app.get('/user/:username', pageController.userProfile)
 	//__FINALLY IF THERE IS NO KNOWN URL INCL. '/' THEN GO TO HOME
 	app.get('/*', pageController.userProfile);


 	sock.get('getRequests', requestsController.getRequests, io)
 	sock.get('updateRequest', requestsController.updateRequest, io)
 	sock.get('createRequest', requestsController.createRequest, io)
 	sock.get('incrementViews', requestsController.incrementViews, io)
 	sock.get('deleteRequest', requestsController.deleteRequest, io)
 	sock.get('incrementUpVotes', requestsController.incrementUpVotes, io)

 	sock.get('submitEmail', recruitEmailSignUpController.submitEmail, io)

 	sock.get('getTrendingPublishers', sideBarController.getTrendingPublishers, io)

 	sock.get('logIn', newUserController.logIn, io)
 	sock.get('signUp', newUserController.signUp, io)
}

