var express = require('express')
var path 		= require('path'),
	rootPath	= path.normalize(__dirname + '/..');

module.exports = function (app, cookieParser) {

	app.set('showStackError', true)
	app.use(express.compress ({
		filter: function (req,res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	//Use the default favicon
	app.use(express.favicon())
	//Setup the public serving directory
	app.use(express.static(rootPath + '/public'))
	//Set to use express loggers
	app.use(express.logger('dev'))
	//Set the view templating engine and the views directory
	app.set('views', rootPath + '/app/views')
	app.set('view engine', 'jade')

	//Default app configurations
	app.configure(function() {
		//cookieParser
		app.use(cookieParser)
		//bodyParser
		app.use(express.bodyParser())
		app.use(express.methodOverride())
		//Use the router
		app.use(app.router)
	})
}