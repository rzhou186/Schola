var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	requestModel = mongoose.model('request')

function processRequests (docs, userData) {
	var returnDocs = [];
	for (var returnLength = 0; returnLength < docs.length; returnLength ++) {
		for (var len = 0; len < userData.upvotedRequests.length; len++) {
			if (docs[returnLength]._id.equals(userData.upvotedRequests[len])) {
				docs[returnLength]['disabled'] = 1;
			}
		}
	}
	return docs;
}
/*
exports.getRequests = function(data, socket) {
	if(data.publisherUsername === "") {
		requestModel.find({},'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
	        score: -1
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
		userModel.find({username : data.publisherUsername}, function (err, docs) {
			if (docs && docs.length > 0) {
				var finalRequests = [];
				requestModel.find({_id : {$in : docs[0].receivedRequests}}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
	        		score : -1
	    		}
		}, function (err, docsTwo) {
					userModel.find({username : data.username}, function (err, userData) {
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
*/
exports.getRequests = function(data, socket) {
	if(data.publisherUsername === "") {
		if (data.streamType == 1) {
			requestModel.find({status : 1},'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
		        score: -1, upvotes : -1
		    }
			}, function (err, docs) {
				userModel.find({username : data.username}, function (err, userData) {
					if(userData && userData.length > 0) {
						if(userData[0].password === data.password) {
							docs = processRequests (docs, userData[0]);
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
			requestModel.find({status : 0},'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
		        score: -1, upvotes : -1
		    }
			}, function (err, docs) {
				userModel.find({username : data.username}, function (err, userData) {
					if(userData && userData.length > 0) {
						if(userData[0].password === data.password) {
							docs = processRequests (docs, userData[0]);
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
	}
	else {
		userModel.find({username : data.publisherUsername}, function (err, docs) {
			if (docs && docs.length > 0) {
				userModel.find({username : data.username}, function (err, userData) {
					if (userData && userData.length > 0) {
						if (userData[0].password === data.password) {
							if (data.streamType == 1) {
								requestModel.find({_id : {$in : docs[0].receivedRequests}, status : 1}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
			        				score : -1, upvotes : -1
			    					}
								}, function (err, docsTwo) {
									docsTwo = processRequests (docsTwo, userData[0]);
									socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 1});
								})
							}
							else {
								requestModel.find({_id : {$in : docs[0].receivedRequests}, status : 0}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
			        				score : -1, upvotes : -1
			    					}
								}, function (err, docsTwo) {
									docsTwo = processRequests (docsTwo, userData[0]);
									socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 1});
								})	
							}
						}
						else {
							if (data.streamType == 1) {
								requestModel.find({_id : {$in : docs[0].receivedRequests}, status : 1}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
			        				score : -1, upvotes : -1
			    					}
								}, function (err, docsTwo) {
									socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 0});
								})
							}
							else {
								requestModel.find({_id : {$in : docs[0].receivedRequests}, status : 0}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
			        				score : -1, upvotes : -1
			    					}
								}, function (err, docsTwo) {
									socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 0});
								})	
							}
						}
					}
					else {
						if (data.streamType == 1) {
							requestModel.find({_id : {$in : docs[0].receivedRequests}, status : 1}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
			        			score : -1, upvotes : -1
			    				}
							}, function (err, docsTwo) {
								socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 0});
							})
						}
						else {
							requestModel.find({_id : {$in : docs[0].receivedRequests}, status : 0}, 'name upvotes requesterId publisherId requesterUsername publisherUsername publisherFirstname publisherLastname status created responseURL responseDescription responseViews responseDate disabled score', { skip: data.start, limit:10, sort:{
			        			score : -1, upvotes : -1
			    				}
							}, function (err, docsTwo) {
								socket.emit ('getRequestsSuccess', {result : docsTwo, isLoggedIn : 0});
							})	
						}
					}
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
					socket.emit('updateRequestSuccess', {updateStatus : 1, isLoggedIn : 1});
				}
				else {
					socket.emit('updateRequestSuccess', {updateStatus : 0, isLoggedIn : 0});
				}
			}
			else {
				socket.emit ('updateRequestSuccess', {updateStatus : 0, isLoggedIn : 0});
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
						userModel.find({username : docsTwo[0].publisherUsername}, function (err, docsThree) {
							if(docsThree && docsThree.length > 0) {
								var index = docsThree[0].receivedRequests.indexOf(data.requestId);
								if (index > -1) {
									docsThree[0].receivedRequests.splice(index, 1);
								}
								docsThree[0].numReceivedRequests--;
								docsThree[0].save();
								docsTwo[0].remove();
								socket.emit('deleteRequestSuccess', {deleteStatus : 1, requestId : data.requestId, isLoggedIn : 1});
							}
							else {
								socket.emit('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId, isLoggedIn : 1});
							}
						})
					}
					else {
						socket.emit ('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId, isLoggedIn : 1});
					}
				})
			}
			else {
				socket.emit ('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId, isLoggedIn : 0});
			}
		}
		else {
			socket.emit ('deleteRequestSuccess', {deleteStatus : 0, requestId : data.requestId, isLoggedIn : 0});
		}
	})
}
exports.createRequest = function(data, socket) {
	userModel.find({username : data.requesterUsername}, function (err, docs) {
		if(docs && docs.length > 0) {
			if(docs[0].password === data.password) {
				userModel.find({username: data.publisherUsername}, function (err, docsTwo) {
					if(docsTwo && docsTwo.length > 0) {
						if(data.name.indexOf("fake") == -1 && data.name.indexOf("delet") == -1 && data.name.indexOf("96") == -1) {
							var newData = {};
							newData.name = data.name;
							newData.upvotes = 1;
							newData.requesterId = docs[0]._id;
							newData.publisherId = docsTwo[0]._id;
							newData.publisherUsername = data.publisherUsername;
							newData.requesterUsername = data.requesterUsername;
							newData.publisherFirstname = data.publisherFirstname;
							newData.publisherLastname = data.publisherLastname;
							newData.status = 0;
							newData.created = new Date();
							newData.responseURL = data.responseURL;
							newData.responseDescription = data.responseDescription;
							newData.responseViews = 0;
							newData.responseDate = new Date();
							newData.disabled = 0;
							newData.score = ((newData.upvotes  + newData.responseViews) * 2) / Math.pow (2, 1.8);
							var newRequest = new requestModel(newData);
							newRequest.save();
							docs[0].postedRequests.push(newRequest._id);
							docs[0].upvotedRequests.push(newRequest._id);
							docs[0].save();
							docsTwo[0].receivedRequests.push(newRequest._id);
							docsTwo[0].numReceivedRequests++;
							docsTwo[0].save();
							socket.emit('createRequestSuccess', {requestStatus : 1, isLoggedIn : 1});
						}
						else {
							socket.emit('createRequestSuccess', {requestStatus : 2, isLoggedIn : 1});
						}
					}
					else {
						socket.emit('createRequestSuccess', {requestStatus : 2, isLoggedIn : 1});
					}
				})
			}
			else {
				socket.emit('createRequestSuccess', {requestStatus : 2, isLoggedIn : 0});
			}
		}
		else {
			socket.emit('createRequestSuccess', {requestStatus : 2, isLoggedIn : 0});
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
							socket.emit('incrementViewsSuccess', {viewStatus : 1, requestId : data.requestId, isLoggedIn : 1});
						}
						else {
							socket.emit('incrementViewsSuccess', {viewStatus : 0, requestId : data.requestId, isLoggedIn : 1});
						}	
				}
				else {
					socket.emit ('incrementViewsSuccess', {viewStatus : 0, requestId : data.requestId, isLoggedIn : 0});
				}
			}
			else {
				socket.emit ('incrementViewsSuccess', {viewStatus : 0, requestId : data.requestId, isLoggedIn : 0});
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
						socket.emit('incrementUpVotesSuccess', {upvoteStatus : 1, requestId : data.requestId, isLoggedIn : 1});

					}
					else {
						socket.emit('incrementUpVotesSuccess', {upvoteStatus : 0, requestId : data.requestId, isLoggedIn : 0});
					}
				}
				else {
					socket.emit('incrementUpVotesSuccess', {upvoteStatus : 0, requestId : data.requestId, isLoggedIn : 0});
				}
			}
			else {
				socket.emit('incrementUpVotesSuccess', {upvoteStatus : 0, requestId : data.requestId, isLoggedIn : 0});
			}
		})
	})
}