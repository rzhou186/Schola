//tried to model it similar to app.get but instead use sockets
exports.get = function(channel, callback, io) {
	io.sockets.on('connection', function (socket) {
		socket.on(channel, function(data){
			callback(data, socket);
		})
	})
}