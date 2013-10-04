/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var userSchema = new mongoose.Schema({
	//schema here 
	username : String,
	password : String,
	isModerator : Number,
	postedResources : [Schema.Types.ObjectId],
	postedRequests : [Schema.Types.ObjectId],
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('user', userSchema);