/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var postSchema = new mongoose.Schema({
	//schema here
	name : String,
	desc : String,
	URL : String,
	views : Number,
	posterId : Schema.Types.ObjectId
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('post', postSchema);