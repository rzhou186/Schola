/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var requestSchema = new mongoose.Schema({
	//schema here
	id : Number, 
	name : String,
	desc : String,
	upvotes : Number,
	posterId : Number
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('request', requestSchema);