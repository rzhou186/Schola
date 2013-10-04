
/**
 * Module dependencies.
 */

var express = require('express'),
    filesystem = require('fs'),
    http = require('http'),
    socket = require('socket.io')


clients = {}

var env = process.env.NODE_ENV || 'development',
    mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/schola')
var app = express();

var cookieParser = express.cookieParser('schola')
require('./config/express')(app, cookieParser)

var server  = http.createServer(app)
var io    = socket.listen(server)


var models_path = __dirname + '/app/models'
filesystem.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

require('./config/routes')(app, io)

var port = process.env.PORT || 3000
server.listen(port)
console.log('listening on port '+port)

//EXPOSE APPLICATION
exports = module.exports = app


