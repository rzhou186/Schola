var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	requestModel = mongoose.model('request')


exports.index = function(req, res) {
	console.log(req.cookies.username);
	console.log(req.cookies.password);
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

exports.userProfile = function(req, res) {
	var currentUsername = req.params.username;
	userModel.find({username : currentUsername}, function (err, docs) {
		if (docs && docs.length > 0) {
			if (docs[0].isPublisher) {
				var returnDocs = {};
				returnDocs.username = docs[0].username;
				returnDocs.firstname = docs[0].firstname;
				returnDocs.lastname = docs[0].lastname;
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


