/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var requestSchema = new mongoose.Schema({
	//schema here
	name : String,
	upvotes : Number,
	posterId : mongoose.Schema.Types.ObjectId,
	status : Number,
	URL : String
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('request', requestSchema);