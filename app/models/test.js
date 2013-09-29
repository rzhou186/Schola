/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var testSchema = new mongoose.Schema({
	//schema here
	scale : String, 
	coords : [Number, Number],
	location : String,
	name : String,
	inits : [String],
	collabs : [String],
	reqs : [String],
	resources : [String],
	work : [String],
	desc : String,
	email : String
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('test', testSchema);