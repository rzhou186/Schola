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
		userModel.find({username : req.cookies.username}, function (err, docs) {
			console.log(docs);
			if(docs && docs.length > 0) {
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
// ask for data.oldlatest
exports.getPosts = function(data, socket) {
	if(data.oldLatest == 0) {
		postModel.count({}, function(err, count) {
			var latest = Math.round(0.3 * count);
			var currentLimit = 3;
			if(latest < 3) {
					currentLimit = latest;
			}
			var skipValue = data.nextLatest;
			if(currentLimit == 0) {
				skipValue = count;
			}
			postModel.find({}, 'name desc URL created views posterId', {skip:skipValue, limit:currentLimit, sort:{
				created: -1, views: -1
			}}, function(err, docs) {
				postModel.find({}, 'name desc URL created views posterId', {skip:latest, limit:7, sort:{
					created: -1, views: -1
				}}, function(err, docs2) {
					docs.sort(function(a,b) {return b.views - a.views});
					docs2.sort(function(a,b) {return b.views - a.views});
					var finalDocs = docs.concat(docs2);
					userModel.find({username : data.username}, function (err, userData) {
						if(userData && userData.length > 0) {
							if(userData[0].password === data.password) {
								socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 1, oldLatest:latest, nextLatest:currentLimit, nextMostViews:latest+7});
							}
							else {
								socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 0, oldLatest:latest, nextLatest:currentLimit, nextMostViews:latest+7});
							}
						}
						else {
							socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 0, oldLatest:latest, nextLatest:currentLimit, nextMostViews:latest+7});
						}
					})					
					// make things return
				})
			})
		})
	}
	else {
		postModel.count({}, function(err, count) {
			var latest = Math.round(0.3*count);
			if(latest == data.oldLatest) {
				var currentLimit = 3;
				if(latest - data.nextLatest < 3) {
					currentLimit = latest-data.nextLatest;
				}
				var skipValue = data.nextLatest;
				if(currentLimit == 0) {
					skipValue = count;
				}
				postModel.find({}, 'name desc URL created views posterId', {skip:skipValue, limit:currentLimit, sort:{
					created: -1, views: -1
				}}, function(err, docs) {
					postModel.find({}, 'name desc URL created views posterId', {skip:data.nextMostViews, limit:7, sort: {
						created: -1, views: -1
					}}, function(err, docs2){
						docs.sort(function(a,b) {return b.views - a.views});
						docs2.sort(function(a,b) {return b.views - a.views});
						var finalDocs = docs.concat(docs2);
						userModel.find({username : data.username}, function (err, userData) {
							if(userData && userData.length > 0) {
								if(userData[0].password === data.password) {
									socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 1, oldLatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews : data.nextMostViews + 7});
								}
								else {
									socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 0, oldLatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews : data.nextMostViews + 7});
								}
							}
							else {
								socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 0, oldLatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews : data.nextMostViews + 7});
							}
						})					
					//make things return
					})
				})
			}
			else {
				var currentLimit = 3;
				data.nextLatest = data.nextLatest + (latest - data.oldLatest);
				data.nextMostViews = data.nextMostViews + (latest - data.oldLatest);
				if(latest - data.nextLatest < 3) {
					currentLimit = latest - data.nextLatest;
				}
				var skipValue = data.nextLatest;
				if(currentLimit == 0) {
					skipValue = count;
				}
				postModel.find({}, 'name desc URL created views posterId', {skip:skipValue, limit:currentLimit, sort: {
					created: -1, views: -1
				}}, function(err, docs) {
					postModel.find({}, 'name desc URL created views posterId', {skip:data.nextMostViews, limit:7, sort: {
						created: -1, views: -1
					}}, function(err, docs2) {
						docs.sort(function(a,b) {return b.views - a.views});
						docs2.sort(function(a,b) {return b.views - a.views});
						var finalDocs = docs.concat(docs2);
						userModel.find({username : data.username}, function (err, userData) {
							if(userData && userData.length > 0) {
								if(userData[0].password === data.password) {
									socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 1, oldLatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews : data.nextMostViews + 7});
								}
								else {
									socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 0, oldLatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews : data.nextMostViews + 7});
								}
							}
							else {
								socket.emit('getPostsSuccess', {result : finalDocs, isLoggedIn : 0, oldLatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews : data.nextMostViews + 7});
							}
						})					
//					socket.emit('getPostsSuccess', {result: finalDocs, isLoggedIn:0, oldlatest:latest, nextLatest:data.nextLatest+currentLimit, nextMostViews: data.nextMostViews+7})
					})
				})
			}
		})
	}
	// else {

	// }
	// postModel.find({},'name desc URL created views posterId', { skip: data.start, limit:10, sort:{
 //        views: -1
 //    }
	// }, function (err, docs) {
	// 	userModel.find({username : data.username}, function (err, userData) {
	// 		if(userData && userData.length > 0) {
	// 			if(userData[0].password === data.password) {
	// 				socket.emit('getPostsSuccess', {result : docs, isLoggedIn : 1});
	// 			}
	// 			else {
	// 				socket.emit('getPostsSuccess', {result : docs, isLoggedIn : 0});
	// 			}
	// 		}
	// 		else {
	// 			socket.emit('getPostsSuccess', {result : docs, isLoggedIn : 0});
	// 		}
	// 	})
	// })
}
/*function(err,allNews){
    socket.emit('news-load', allNews); // Do something with the array of 10 objects
})
	postModel.find({}, function (err, docs) {
		socket.emit('getPostsSuccess', {result : docs})
	})
}
*/
/* Gets the user name of the user with _id equal to data._id. Thus, pass in a
JSON object containing the _id
*/

exports.getUserName = function(data, socket) {
	userModel.find({_id : data.posterId}, function (err, docs) {
		if(docs && docs.length > 0) {
			socket.emit('getUserNameSuccess', {getUserNameStatus : 1, result : docs[0].username, postId : data.postId});
		}
		else {
			socket.emit('getUserNameSuccess', {getUserNameStatus : 0, result : false, postId : data.postId});
		}
	})
}

exports.getRequests = function(data, socket) {
	requestModel.find({},'name upvotes created posterId status URL', { skip: data.start, limit:10, sort:{
        upvotes: -1
    }
	}, function (err, docs) {
		userModel.find({username : data.username}, function (err, userData) {
			if(userData && userData.length > 0) {
				if(userData[0].password === data.password) {
					socket.emit('getRequestsSuccess', {result : docs, isLoggedIn : 1});
				}
				else {
					socket.emit('getRequestsSuccess', {result : docs, isLoggedIn : 0});
				}
			}
			else {
				socket.emit('getRequestsSuccess', {result : docs, isLoggedIn : 0});
			}
		})
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
				newData.created = new Date();
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

/* Just the _id of the post is good to go. Someone who's not logged in,
can view it again and again and increase the views, that should be fine yes?

or do we want similar constraints as requests?
*/
exports.incrementViews = function(data, socket) {
	console.log(data);
	postModel.find({_id : data.postId}, function (err, docs) {
		docs[0].views++;
		docs[0].save()
		socket.emit('incrementViewsSuccess', {viewStatus : 1, postId : data.postId})
	})
}

/* Pass in a JSON object with username, password of the person logged in
and the id of the request generated. The result returned is upVoteStatus = 1 if and only
if the increment was successful.

The idea behind checking if someone is logged in or not is to make sure that 
a request is not upvoted by the same person again and again, so I also added
a upvoted requests field in the user model.
*/
exports.incrementUpVotes = function(data, socket) {
	requestModel.find({_id : data.requestId}, function (err, docs) {
		userModel.find({username : data.username}, function (err, userData) {
			if(userData && userData.length > 0) {
				if(userData[0].password === data.password) {
					if(userData[0].upvotedRequests.indexOf(docs[0]._id) == -1) {
						docs[0].upvotes++;
						docs[0].save();
						userData[0].upvotedRequests.push(docs[0]._id);
						userData[0].save();
						socket.emit('incrementUpVotesSuccess', {upvoteStatus : 1, requestId : data.requestId});

					}
					else {
						socket.emit('incrementUpVotesSuccess', {upvoteStatus : 0, requestId : data.requestId});
					}
				}
				else {
					socket.emit('incrementUpVotesSuccess', {upvoteStatus : 0, requestId : data.requestId});
				}
			}
			else {
				socket.emit('incrementUpVotesSuccess', {upvoteStatus : 0, requestId : data.requestId});
			}
		})
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
				newData.created  = new Date();
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
			user.created = new Date();
			user.postedPosts = [];
			user.postedRequests = [];
			user.upvotedRequests = [];
			var newUser = new userModel(user);
			newUser.save();
			//var user = [ {username : data.username}, {password : data.password}, {isModerator : 0}, {postedPosts : []}, {postedRequests : []}]
			//var newUser = new userModel(user)
			//newUser.insert()
			socket.emit('signUpSuccess', {signUpStatus : 2})
		}
	})
}
