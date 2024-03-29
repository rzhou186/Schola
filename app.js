
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

/* ---------- Start Context.IO Test Code ---------- */

var router = express.Router();
router.post('/', function(req, res) {
  console.log("Yay! Something happened!");
  console.log(req.body);
});
app.use('/context-test', router);

/* ---------- End Context.IO Test Code ------------ */

require('./config/routes')(app, io)

var port = process.env.PORT || 80
server.listen(port)
console.log('listening on port '+port)

//EXPOSE APPLICATION
exports = module.exports = app

