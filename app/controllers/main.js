//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	postModel = mongoose.model('post'),
	requestModel = mongoose.model('request'),
	users = require('../../config/users.json')
	// mock_data = JSON.parse(fs)

exports.index = function(req, res) {
	console.log(req.cookies.username);
	console.log(req.cookies.password);
	console.log(req.cookies);
	//find all the files linked to that user and pass them on to the template
	if (req.cookies.username == undefined || req.cookies.password == undefined) {
		res.render('index', {isLoggedIn : 0, isModerator : 0})
	}
	else {
		console.log("I'm here");
		userModel.find({username : req.cookies.username}, function (err, docs) {
			console.log(docs);
			if(docs && docs.length > 0) {
				console.log("I'm here");
				if(docs[0].password === req.cookies.password) {
					res.render('index', {isLoggedIn : 1, isModerator : docs[0].isModerator});
				}
				else {
					res.render('index', {isLoggedIn : 0, isModerator : 0})
				}
			}
			else {
				res.render('index', {isLoggedIn : 0, isModerator : 0})
			}
		})
	}
}

exports.getPosts = function(data, socket) {
	postModel.find({},'name desc URL views posterId', { skip: data.start, limit:10, sort:{
        name: 1
    }
	}, function (err, docs) {
		socket.emit('getPostsSuccess', {result : docs})
	})
}
/*function(err,allNews){
    socket.emit('news-load', allNews); // Do something with the array of 10 objects
})
	postModel.find({}, function (err, docs) {
		socket.emit('getPostsSuccess', {result : docs})
	})
}
*/
exports.getRequests = function(data, socket) {
	requestModel.find({}, function (err, docs) {
		socket.emit('getRequestsSuccess', {result : docs})
	})
}

exports.postRequest = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				var newData = {};
				newData.name = data.name;
				newData.upvotes = 0;
				newData.status = 0;
				newData.posterId = docs[0]._id;
				newData.URL = data.URL;
				var newPost = new requestModel(newData);
				newPost.save();
				docs[0].postedRequests.push(newPost._id);
				docs[0].save();
				socket.emit('postRequestSuccess', {requestStatus : 1});
			}
			else {
				socket.emit('postRequestSuccess', {requestStatus : 2});
			}
		}
		else {
			socket.emit('postRequestSuccess', {requestStatus : 2});
		}
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
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				var newData = {};
				newData.name = data.name;
				newData.desc = data.desc;
				newData.URL = data.URL;
				newData.views = 0;
				newData.posterId = docs[0]._id;
				var newPost = new postModel(newData);
				newPost.save();
				docs[0].postedPosts.push(newPost._id);
				docs[0].save();
				socket.emit('postPostSuccess', {postStatus : 1});
			}
			else {
				socket.emit('postPostSuccess', {postStatus : 2});
			}
		}
		else {
				socket.emit('postPostSuccess', {postStatus : 2});
		}
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
