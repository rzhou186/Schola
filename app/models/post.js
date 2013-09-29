/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var postSchema = new mongoose.Schema({
	//schema here
	id : Number, 
	name : String,
	desc : String,
	type : String,
	upvotes : Number,
	posterId : Number,
	tags : [String],
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('post', postSchema);