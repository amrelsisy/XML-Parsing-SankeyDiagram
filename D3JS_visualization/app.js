
var server = require('node-http-server');
console.log(server);
server.deploy(
{
	verbose: true,
	port:8888,
	root: 'C:/Users/Amr/Desktop/D3JS_visualization'
});