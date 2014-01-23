//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	requestModel = mongoose.model('request'),
	users = require('../../config/users.json')
	// mock_data = JSON.parse(fs)

exports.userProfile = function(req, res) {
	var currentUserName = req.params.username;
	userModel.find({username : currentUserName}, function (err, docs) {
		userModel.find({username : req.cookies.username}, function (err, docsTwo) {
			if(docsTwo && docsTwo.length > 0) {
				if (docsTwo[0].password === req.cookies.password) {
					if(docs && docs.length > 0) {
						var returnDocs = {};
						returnDocs.username = docs[0].username;
						returnDocs._id = docs[0]._id;
						returnDocs = JSON.stringify(returnDocs);
						res.render('user', {data : returnDocs, isLoggedIn : 1, isSatisfier : docsTwo[0].isSatisfier})
					}
					else {
						res.render('user', {data : {}, isLoggedIn : 1, isSatisfier: docsTwo[0].isSatisfier})
					}
				}
				else {
					res.render('user', {data : {}, isLoggedIn : 0, isSatisfier : 0})
				}
			}
			else {
				res.render('user', {data : {}, isLoggedIn : 0, isSatisfier : 0})
			}
		})

	})
}

exports.index = function(req, res) {
	console.log(req.cookies.username);
	console.log(req.cookies.password);
	console.log(req.cookies);
	//find all the files linked to that user and pass them on to the template
	if (req.cookies.username == undefined || req.cookies.password == undefined) {
		res.render('index', {isLoggedIn : 0, isSatisfier : 0})
	}
	else {
		userModel.find({username : req.cookies.username}, function (err, docs) {
			console.log(docs);
			if(docs && docs.length > 0) {
				if(docs[0].password === req.cookies.password) {
					res.render('index', {isLoggedIn : 1, isSatisfier : docs[0].isSatisfier});
				}
				else {
					res.render('index', {isLoggedIn : 0, isSatisfier : 0})
				}
			}
			else {
				res.render('index', {isLoggedIn : 0, isSatisfier : 0})
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
	if(data.satisfierName === "") {
		requestModel.find({},'name upvotes requesterId satisfierId requesterName satisfierName status created responseURL responseDescription responseViews responseDate', { skip: data.start, limit:10, sort:{
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
	else {
		userModel.find({username : data.satisfierName}, function (err, docs) {
			if (docs && docs.length > 0) {
				var finalRequests = [];
				for (var i = 0; i < docs[0].receivedRequests.length; i++) {
					requestModel.find({_id : docs[0].receivedRequests[i]}, function (err, docsTwo) {
						finalRequests.push(docs[0]);
					})
				}
				socket.emit('getRequestsSuccess', {result : finalRequests});
			}
			else {
				socket.emit('getRequestsSuccess', {result : []})
			}
		})
	}
}

exports.updateRequest = function (data, socket) {
	requestModel.find({_id : data.requestId}, function (err, docs) {
		userModel.find({username : data.username}, function (err, docsTwo) {
			if (docsTwo && docsTwo.length > 0) {
				if (docsTwo[0].password === data.password) {
					docs[0].status = 1;
					docs[0].responseURL = data.responseURL;
					docs[0].responseDescription = data.responseDescription;
					docs[0].responseDate = new Date();
					docs[0].save();
					socket.emit('updateRequestSuccess', {updateStatus : 1});
				}
				else {
					socket.emit('updateRequestSuccess', {updateStatus : 0});
				}
			}
			else {
				socket.emit ('updateRequestSuccess', {updateStatus : 0});
			}
		})
	})
}
exports.createRequest = function(data, socket) {
	userModel.find({username : data.requesterName}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				userModel.find({username: data.satisfierName}, function (err, docsTwo) {
					if(docsTwo && docsTwo.length > 0) {
						var newData = {};
						newData.name = data.name;
						newData.upvotes = 0;
						newData.requesterId = docs[0].requesterId;
						newData.satisfierId = docs[0].satisfierId;
						newData.satisfierName = docs[0].satisfierName;
						newData.requesterName = docs[0].requesterName;
						newData.status = 0;
						newData.created = new Date();
						newData.responseURL = data.responseURL;
						newData.responseDescription = data.responseDescription;
						newData.responseViews = 0;
						newData.responseDate = new Date();
						var newRequest = new requestModel(newData);
						newRequest.save();
						docs[0].postedRequests.push(newRequest._id);
						docs[0].save();
						docsTwo[0].receivedRequests.push(newRequest._id);
						docsTwo[0].save();
						socket.emit('createRequestSuccess', {requestStatus : 1});
					}
					else {
						socket.emit('createRequestSuccess', {requestStatus : 2});
					}
				})
			}
			else {
				socket.emit('createRequestSuccess', {requestStatus : 2});
			}
		}
		else {
			socket.emit('createRequestSuccess', {requestStatus : 2});
		}
	})
}

/* Just the _id of the post is good to go. Someone who's not logged in,
can view it again and again and increase the views, that should be fine yes?

or do we want similar constraints as requests?
*/
exports.incrementViews = function(data, socket) {
	requestModel.find({_id : data.requestId}, function (err, docs) {
		userModel.find({username : data.username}, function (err, userData) {
			if(userData && userData.length > 0) {
				if (userData[0].password === data.password) {
						docs[0].responseViews++;
						docs[0].save()
						socket.emit('incrementViewsSuccess', {viewStatus : 1})
				}
				else {
					socket.emit ('incrementViewsSuccess', {viewStatus : 0})
				}
			}
			else {
				socket.emit ('incrementViewsSuccess', {viewStatus : 0})
			}
		})
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
			user.isSatisfier = 0;
			user.created = new Date();
			user.postedPosts = [];
			user.postedRequests = [];
			user.upvotedRequests = [];
			user.receivedRequests = [];
			user.description = "";
			var newUser = new userModel(user);
			newUser.save();
			//var user = [ {username : data.username}, {password : data.password}, {isModerator : 0}, {postedPosts : []}, {postedRequests : []}]
			//var newUser = new userModel(user)
			//newUser.insert()
			socket.emit('signUpSuccess', {signUpStatus : 2})
		}
	})
}
