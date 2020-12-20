const http = require('http');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static("images"));

var things = require('./things.js');
app.use('/', things);

const server = http.createServer(app);
const port = 60000;
server.listen(port);

console.debug('Server listening on port ' + port);