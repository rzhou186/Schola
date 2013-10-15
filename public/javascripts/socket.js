var socket;

socket = io.connect('/');
socket.emit('test', {success:true});
socket.on('testCallback', function(data) {
	console.log('client side test successful');
});
console.log(CryptoJS.SHA1("Message").toString(CryptoJS.enc.hex));
