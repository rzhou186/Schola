//#######__MODULE DEPENDENCIES__#########
var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	main 			= require('../app/controllers/main')
	//more can come here
	app.get('/', main.index);
 	//__FINALLY IF THERE IS NO KNOWN URL INCL. '/' THEN GO TO HOME
 	app.get('/*', main.index);

 	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true});
 	}, io);

 	sock.get('postRequest', main.postRequest, io)
 	sock.get('incrementViews', main.incrementViews, io)
 	sock.get('incrementUpVotes', main.incrementUpvotes, io)
 	sock.get('postPost', main.postPost, io)
 	sock.get('addTestUsers', main.addTestUsers, io)
 	sock.get('logIn', main.logIn, io)
 	sock.get('signUp', main.signUp, io)
}

