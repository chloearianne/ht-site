const http = require('http');
const express = require('express');
var cors = require("cors");

const app = express();
app.use(cors());

app.get('/status', function(req, res){
    console.log(req.get('host'))
    var status = IS_DEAD ? "dead" : "alive";
    console.log("he ", status)
    res.send(status);
});
app.get('/', function(req, res){
    console.log(req.get('host'))
    var status = IS_DEAD ? "dead" : "alive";
    console.log("he ", status)
    res.send(status);
});

const server = http.createServer(app);


var io = require('socket.io')(server, {
    cors: {
        origin: "https://hi-turble.com",
        methods: ["GET", "POST"]
    }
});

const port = 80;

server.listen(port);
//console.debug('Server listening on port ' + port + ' and hostname ' + hostname);
console.debug('Server listening on port ' + port)

var interval;
io.on("connection", (socket) => {
    console.log("New client connected");
    currentVisitors++; 
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => emitStatusData(socket), 1000);

    socket.on('disconnect', function() {
        currentVisitors--; 
        console.log("visitor left", currentVisitors);
        clearInterval(interval);
    });
});

const emitStatusData = (socket) => {
    const response = IS_DEAD
    socket.emit("FromAPI", response);
};


var IS_DEAD = true;
var currentVisitors = 0;
async function updateLivingStatus() {
    while (true) {
        console.log(currentVisitors)
        if (currentVisitors > 0) {
            console.log("turble lives! ")
            IS_DEAD = false;
        } else {
            console.log("turble died :( ")
            IS_DEAD = true;
        }
        await sleep(10000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

updateLivingStatus(); 
