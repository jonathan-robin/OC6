const http = require('http'); // http to create server
const app = require('./app'); // import app
const dotenv = require("dotenv");
dotenv.config();

app.set('port', process.env.PORT); // set the port 
const server = http.createServer(app); 

server.listen(process.env.PORT); // listening on port 
server.on('listening', () => console.log('listening on ' + process.env.PORT)); // log when server is running