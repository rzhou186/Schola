var mongoose 	= require('mongoose'),
	userModel	= mongoose.model('user'),
	requestModel = mongoose.model('request')
	// cronJob = require('cron').CronJob;

// var job = new cronJob('*/300 * * * * *', function() {
// 		updateScores();
// 	}
// );

// job.start();


function updateScores() {
	requestModel.find({}, function (err, docs) {
		var currentDate = new Date();
		for (var i = 0; i < docs.length; i++) {
			docs[i].score = ((docs[i].upvotes + docs[i].responseViews) * 2) / Math.pow((currentDate - docs[i].created)/36e5 + 2, 1.8)
			docs[i].save()
		}
	})
}