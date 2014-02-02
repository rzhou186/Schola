/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var requestSchema = new mongoose.Schema({
	//schema here
	name : String,
	upvotes : Number,
	requesterId : mongoose.Schema.Types.ObjectId,
	satisfierId : mongoose.Schema.Types.ObjectId,
	requesterName : String,
	satisfierName : String,
	status : Number,
	created : Date,
	responseURL : String,
	responseDescription : String,
	responseViews : Number,
	responseDate : Date,
	disabled : Number
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('request', requestSchema);