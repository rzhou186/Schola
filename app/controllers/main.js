//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	postModel = mongoose.model('post'),
	requestModel = mongoose.model('request'),
	users = require('../../config/users.json')
	// mock_data = JSON.parse(fs)

exports.index = function(req, res) {
	//find all the files linked to that user and pass them on to the template
	if (req.cookies.username == undefined || req.cookies.password == undefined) {
		res.render('index', {status : 1, userStatus : 0})
	}
	else {
		userModel.find({username : req.cookies.username}, function (err, docs) {
			if(docs) {
				if(docs.password === req.cookies.password) {
					req.session.username = docs;
					res.render('index', {status : 2, userStatus : docs.isModerator});
				}
				else {
					res.render('index', {status : 1, userStatus : 0})
				}
			}
			else {
				res.render('index', {status : 1, userStatus : 0})
			}
		})
	}
}

exports.getPosts = function(data, socket) {
	postModel.find({}, function (err, docs) {
		socket.emit('getFeedSuccess', {result : docs})
	})
}

exports.getRequests = function(data, socket) {
	requestModel.find({}, function (err, docs) {
		socket.emit('getRequestsSuccess', {result : docs})
	})
}

exports.postRequest = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		var newData = [{name : data.name}, {upvotes : 0}, {posterId : docs._id}, {status : 0}]
		var newRequest = new requestModel (newData)
		newRequest.save()
		console.log('Request saved')
		socket.emit('postRequestSuccess', {result : docs})
	})
}


exports.incrementViews = function(data, socket) {
	postModel.find({_id : data._id}, function (err, docs) {
		docs.views++;
		docs.save()
		socket.emit('incrementViewsSuccess', {result : docs})
	})
}
exports.incrementUpVotes = function(data, socket) {
	requestModel.find({id : data._id}, function (err, docs) {
		docs.upvotes++;
		docs.save()
		socket.emit('incrementUpVotesSuccess', {result : docs})
	})
}

exports.postPost = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		var newData = [{name : data.name}, {desc : data.desc}, {URL : data.url}, {views : 0}, {posterId : docs._id}]
		var newPost = new postModel(newData)
		newPost.save()
		console.log('Request saved')
		socket.emit('postPost', {result : docs})
	})
}
 

exports.addTestUsers = function(data, socket) {
	for (var i in users.user) {
		console.log(users.user[i])
		var user = new userModel(users.user[i])
		user.save()
	}
	console.log("Users added");
}

exports.logIn = function(data, socket) {
	console.log(data.username);
	console.log(data.password);
	userModel.find({username : data.username}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs.password === data.password) {
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
	console.log(data.username);
	console.log(data.password);
	userModel.find({username : data.username}, function (err, docs) {
		if(docs && docs.length > 0) {
			socket.emit('signUpSuccess', {signUpStatus : 1})
		}
		else {
			console.log(data.username);
			console.log(data.password);
			var user = {};
			user.username = data.username;
			user.password = data.password;
			user.isModerator = 0;
			user.postedPosts = [];
			user.postedRequests = [];
			var newUser = new userModel(user);
			newUser.save();
			//var user = [ {username : data.username}, {password : data.password}, {isModerator : 0}, {postedPosts : []}, {postedRequests : []}]
			//var newUser = new userModel(user)
			//newUser.insert()
			socket.emit('signUpSuccess', {signUpStatus : 2})
		}
	})
}
