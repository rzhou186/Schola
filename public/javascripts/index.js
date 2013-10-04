$(document).ready(function () {

	var socket = io.connect('/');
	socket.emit('test', {success:true});
	socket.on('testCallback', function(data) {
		console.log('client side test successful');
	});
	sock.emit('getPosts', {success:true})
	socket.on('getPostsSuccess', function(data) {
		console.log("Got all Posts")
		console.log(data);	
	})
	socket.emit('getRequests', {success:true})
	socket.on('getRequestsSuccess', function(data) {
		console.log("Got all requests")
		console.log(data);
	})
	
});