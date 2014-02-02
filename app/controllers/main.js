//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	requestModel = mongoose.model('request'),
	emailModel = mongoose.model('email'),
	users = require('../../config/users.json')
	// mock_data = JSON.parse(fs)

exports.recruit = function(req, res) {
	userModel.find({username : req.cookies.username}, function (err, docs) {
		if (docs && docs.length > 0) {
			if (docs[0].password === req.cookies.password) {
				res.render ('recruitPage', {isLoggedIn : 1, isPublisher : docs[0].isPublisher});
			}
			else {
				res.render ('recruitPage', {isLoggedIn : 0, isPublisher : 0});
			}
		}
		else {
			res.render ('recruitPage', {isLoggedIn : 0, isPublisher : 0});
		}
	})
}


exports.submitEmail = function(data, socket) {
	emailModel.find({email : data.email}, function (err, docs) {
		if (!(docs.length)) {
			var newData = {};
			newData.email = data.email;
			var newEmail =  new emailModel(newData);
			newEmail.save();
			socket.emit('submitEmailSuccess', {submitStatus : 1});
		}
		else {
			socket.emit('submitEmailSuccess', {submitStatus : 0});
		}
	})
}

exports.getTrendingPublishers = function (data, socket) {
	var trendingQuery = userModel.find({isPublisher : 1});
	trendingQuery.select('username receivedRequests').sort({receivedRequests : -1}).limit(5);
	trendingQuery.exec(function (err, publishers) {
		socket.emit ('getTrendingPublishersSuccess', {result : publishers});
	})
}
exports.userProfile = function(req, res) {
	var currentUserName = req.params.username;
	userModel.find({username : currentUserName}, function (err, docs) {
		if (docs && docs.length > 0) {
			if (docs[0].isPublisher) {
				var returnDocs = {};
				returnDocs.username = docs[0].username;
				returnDocs._id = docs[0]._id;
				returnDocs.description = docs[0].description;
				returnDocs = JSON.stringify(returnDocs);
				userModel.find({username : req.cookies.username}, function (err, docsTwo) {
					if(docsTwo && docsTwo.length > 0) {
						if (docsTwo[0].password === req.cookies.password) {
								res.render('userPage', {data : returnDocs, isLoggedIn : 1, isPublisher : docsTwo[0].isPublisher})
						}
						else {
							res.render('userPage', {data : returnDocs, isLoggedIn : 0, isPublisher : 0})
						}
					}
					else {
						res.render('userPage', {data : returnDocs, isLoggedIn : 0, isPublisher : 0})
					}
				})
			}
			else {
				userModel.find({username : req.cookies.username}, function (err, docsTwo) {
					if (docsTwo && docsTwo.length > 0) {
						if (docsTwo[0].password === req.cookies.password) {
							res.render ('errorPage', { isLoggedIn : 1, isPublisher : docsTwo[0].isPublisher});
						}
						else {
							res.render ('errorPage', { isLoggedIn : 0, isPublisher : 0});
						}
					}
					else {
						res.render('errorPage', { isLoggedIn : 0, isPublisher : 0});
					}
				})
			}
		}
		else {
			userModel.find({username : req.cookies.username}, function (err, docsTwo) {
				if (docsTwo && docsTwo.length > 0) {
					if (docsTwo[0].password === req.cookies.password) {
						res.render ('errorPage', { isLoggedIn : 1, isPublisher : docsTwo[0].isPublisher});
					}
					else {
						res.render ('errorPage', {isLoggedIn : 0, isPublisher : 0});
					}
				}
				else {
					res.render('errorPage', {isLoggedIn : 0, isPublisher : 0});
				}
			})
		}
	})
}

exports.index = function(req, res) {
	//find all the files linked to that user and pass them on to the template
	if (req.cookies.username == undefined || req.cookies.password == undefined) {
		res.render('homePage', {isLoggedIn : 0, isPublisher : 0})
	}
	else {
		userModel.find({username : req.cookies.username}, function (err, docs) {
			if(docs && docs.length > 0) {
				if(docs[0].password === req.cookies.password) {
					res.render('homePage', {isLoggedIn : 1, isPublisher : docs[0].isPublisher});
				}
				else {
					res.render('homePage', {isLoggedIn : 0, isPublisher : 0})
				}
			}
			else {
				res.render('homePage', {isLoggedIn : 0, isPublisher : 0})
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


function processRequests (docs, userData) {
	var returnDocs = [];
	for (var returnLength = 0; returnLength < docs.length; returnLength ++) {
		for (var len = 0; len < userData[0].upvotedRequests.length; len++) {
			if (docs[returnLength]._id.equals(userData[0].upvotedRequests[len])) {
				docs[returnLength]['disabled'] = 1;
			}
		}
	}
	return docs;
}
exports.getRequests = function(data, socket) {
	if(data.publisherName === "") {
		requestModel.find({},'name upvotes requesterId publisherId requesterName publisherName status created responseURL responseDescription responseViews responseDate disabled', { skip: data.start, limit:10, sort:{
	        upvotes: -1
	    }
		}, function (err, docs) {
			userModel.find({username : data.username}, function (err, userData) {
				if(userData && userData.length > 0) {
					if(userData[0].password === data.password) {
						docs = processRequests (docs, userData);
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
		userModel.find({username : data.publisherName}, function (err, docs) {
			if (docs && docs.length > 0) {
				var finalRequests = [];
				requestModel.find({_id : {$in : docs[0].receivedRequests}}, 'name upvotes requesterId publisherId requesterName publisherName status created responseURL responseDescription responseViews responseDate', { skip: data.start, limit:10, sort:{
	        		upvotes: -1
	    		}
		}, function (err, docsTwo) {
					userModel.find({username : data.username}, function(err, userData) {
						if (userData && userData.length > 0) {
							if(userData[0].password === data.password) {
								docsTwo = processRequests (docsTwo, userData);
								socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 1});
							}
							else {
								socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 0});
							}
						}
						else {
							socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 0});
						}
					})

				})
			}
			else {
				userModel.find({username : data.username}, function (err, userData) {
					if (userData && userData.length > 0) {
						if (userData[0].password === data.password) {
							socket.emit('getRequestsSuccess', {result : {}, isLoggedIn : 1})
						}
						else {
							socket.emit('getRequestsSuccess', {result : {}, isLoggedIn : 0})
						}
					}
					else {
						socket.emit('getRequestsSuccess', {result : {}, isLoggedIn : 0})
					}
				})				
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

exports.deleteRequest = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				requestModel.find({_id : data.requestId}, function (err, docsTwo) {
					if (docsTwo && docsTwo.length > 0) {
						docsTwo[0].remove();

						// Remove from user's received requests
						// Remove from upvoted requests of everyone else
						socket.emit ('deleteRequestSuccess', {deleteStatus : 1, requestId : data.requestId});
					}
					else {
						socket.emit ('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId});
					}
				})
			}
			else {
				socket.emit ('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId});
			}
		}
		else {
			socket.emit ('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId});
		}
	})
}
exports.createRequest = function(data, socket) {
	userModel.find({username : data.requesterName}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				userModel.find({username: data.publisherName}, function (err, docsTwo) {
					if(docsTwo && docsTwo.length > 0) {
						var newData = {};
						newData.name = data.name;
						newData.upvotes = 0;
						newData.requesterId = docs[0]._id;
						newData.publisherId = docsTwo[0]._id;
						newData.publisherName = data.publisherName;
						newData.requesterName = data.requesterName;
						newData.status = 0;
						newData.created = new Date();
						newData.responseURL = data.responseURL;
						newData.responseDescription = data.responseDescription;
						newData.responseViews = 0;
						newData.responseDate = new Date();
						newData.disabled = 0;
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
						if(docs[0].status == 1) {
							docs[0].responseViews++;
							docs[0].save()
							socket.emit('incrementViewsSuccess', {viewStatus : 1, requestId : data.requestId});
						}
						else {
							socket.emit('incrementViewsSuccess', {viewStatus : 0, requestId : data.requestId});
						}	
				}
				else {
					socket.emit ('incrementViewsSuccess', {viewStatus : 0, requestId : data.requestId});
				}
			}
			else {
				socket.emit ('incrementViewsSuccess', {viewStatus : 0, requestId : data.requestId});
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
	console.log ("IN SIGN UP FUNCTION :DDD");
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
			user.isPublisher = 0;
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
