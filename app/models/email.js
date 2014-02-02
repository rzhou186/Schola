/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var emailSchema = new mongoose.Schema({
	//schema here
	email : String
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('email', emailSchema);