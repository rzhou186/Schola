var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user')


exports.getTrendingPublishers = function (data, socket) {
	var trendingQuery = userModel.find({isPublisher : 1});
	trendingQuery.select('username firstname lastname numReceivedRequests').sort({numReceivedRequests : -1});
	trendingQuery.exec(function (err, publishers) {
		socket.emit ('getTrendingPublishersSuccess', {result : publishers});
	})
}