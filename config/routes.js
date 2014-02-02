//#######__MODULE DEPENDENCIES__#########
var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	main 			= require('../app/controllers/main')
	//more can come here
	app.get('/', main.index);
	app.get('/recruit', main.recruit);
	app.get('/user/:username', main.userProfile)
 	//__FINALLY IF THERE IS NO KNOWN URL INCL. '/' THEN GO TO HOME
 	app.get('/*', main.userProfile);

 	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true});
 	}, io);

 	sock.get('getRequests', main.getRequests, io)
 	sock.get('updateRequest', main.updateRequest, io)
 	sock.get('createRequest', main.createRequest, io)
 	sock.get('incrementViews', main.incrementViews, io)
 	sock.get('deleteRequest', main.deleteRequest, io)
 	sock.get('submitEmail', main.submitEmail, io)
 	sock.get('getTrendingPublishers', main.getTrendingPublishers, io)
 	sock.get('incrementUpVotes', main.incrementUpVotes, io)
 	sock.get('logIn', main.logIn, io)
 	sock.get('signUp', main.signUp, io)
}

