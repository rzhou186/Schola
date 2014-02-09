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
