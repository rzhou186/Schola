/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var userSchema = new mongoose.Schema({
	username : String,
	password : String,
	isSatisfier : Number,
	created : Date,
	description : String,
	receivedRequests : [mongoose.Schema.Types.ObjectId],
	upvotedRequests : [mongoose.Schema.Types.ObjectId],
	postedRequests : [mongoose.Schema.Types.ObjectId],
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('user', userSchema);