var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user')


exports.logIn = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				socket.emit('logInSuccess', {logInStatus : 2})
			}
			else {
				socket.emit('logInSuccess', {logInStatus : 1})
			}
		}
		else {
			socket.emit('logInSuccess', {logInStatus : 1})
		}
	})
}

exports.signUp = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		if(docs && docs.length > 0) {
			socket.emit('signUpSuccess', {signUpStatus : 1})
		}
		else {
			var user = {};
			user.username = data.username;
			user.password = data.password;
			user.isPublisher = 0;
			user.created = new Date();
			user.postedPosts = [];
			user.postedRequests = [];
			user.firstname = "";
			user.lastname = "";
			user.email = "";
			user.upvotedRequests = [];
			user.receivedRequests = [];
			user.description = "";
			user.numReceivedRequests = 0;
			var newUser = new userModel(user);
			newUser.save();
			socket.emit('signUpSuccess', {signUpStatus : 2})
		}
	})
}