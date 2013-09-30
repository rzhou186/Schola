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
