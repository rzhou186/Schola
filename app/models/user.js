/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var userSchema = new mongoose.Schema({
	username : String,
	firstname : String,
	lastname : String,
	email : String,
	password : String,
	isPublisher : Number,
	created : Date,
	description : String,
	numReceivedRequests : Number,
	receivedRequests : [mongoose.Schema.Types.ObjectId],
	upvotedRequests : [mongoose.Schema.Types.ObjectId],
	postedRequests : [mongoose.Schema.Types.ObjectId],
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('user', userSchema);