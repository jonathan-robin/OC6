const http = require('http'); // http to create server
const app = require('./app'); // import app
const port = 3000; // instantiate port number
const dotenv = require("dotenv");
dotenv.config();

app.set('port', port); // set the port 
const server = http.createServer(app); 

server.listen(port); // listening on port 
server.on('listening', () => console.log('listening on ' + port + process.env.CLUSTER_NAME + process.env.CLUSTER_PASSWORD)); // log when server is running