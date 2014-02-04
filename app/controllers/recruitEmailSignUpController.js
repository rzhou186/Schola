var mongoose 	= require('mongoose'),
	emailModel = mongoose.model('email')

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