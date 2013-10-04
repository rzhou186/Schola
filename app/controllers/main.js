//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	postModel = mongoose.model('post'),
	requestModel = mongoose.model('request')
	// mock_data = JSON.parse(fs)

exports.index = function(req, res) {
	//find all the files linked to that user and pass them on to the template
	res.render('index');
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

exports.postResource = function(data, socket) {
	userModel.find({username : data.username}, function (err, docs) {
		var newData = [{name : data.name}, {desc : data.desc}, {URL : data.url}, {views : 0}, {posterId : docs._id}]
		var newPost = new postModel(newData)
		newPost.save()
		console.log('Request saved')
		socket.emit('postResourceSuccess', {result : docs})
	})
}
 
