/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var userSchema = new mongoose.Schema({
	//schema here
	id : Number, 
	username : String,
	password : String,
	isModerator : Number,
	postedResources : [Number],
	postedRequests : [Number],
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('user', userSchema);