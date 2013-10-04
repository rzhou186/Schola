/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var requestSchema = new mongoose.Schema({
	//schema here
	name : String,
	upvotes : Number,
	posterId : Schema.Types.ObjectId,
	status : Number,
	satisfierId : Schema.Types.ObjectId
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('request', requestSchema);