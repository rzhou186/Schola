/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var requestSchema = new mongoose.Schema({
	//schema here
	name : String,
	upvotes : Number,
	requesterId : mongoose.Schema.Types.ObjectId,
	publisherId : mongoose.Schema.Types.ObjectId,
	requesterUsername : String,
	publisherUsername : String,
	publisherFirstname : String,
	publisherLastname : String,
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