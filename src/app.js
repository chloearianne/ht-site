const http = require('http');
const express = require('express');
var cors = require("cors");

const app = express();
app.use(cors());

app.get('/status', function(req, res){
    console.log("he ", IS_DEAD)
    res.send({ 
        isDead: IS_DEAD, 
        timeAlive: TIME_ALIVE,
        recordTime: RECORD_TIME
    });
});

const server = http.createServer(app);

var io = require('socket.io')(server, {
    cors: {
        origin: "https://hi-turble.com",
        methods: ["GET", "POST"]
    }
});

const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port)

var interval;
io.on("connection", (socket) => {
    console.log("New client connected");
    currentVisitors++; 
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => emitStatusData(socket), 500);

    socket.on('disconnect', function() {
        currentVisitors--; 
        console.log("visitor left", currentVisitors);
        clearInterval(interval);
    });
});

const emitStatusData = (socket) => {
    const response = {
        isDead: IS_DEAD,
        timeAlive: TIME_ALIVE,
        recordTime: RECORD_TIME,
    }
    socket.emit("FromAPI", response);
};

var INIT_TIME = new Date().getTime();
var TIME_ALIVE;
var RECORD_TIME = 0;
var IS_DEAD = true;
var currentVisitors = 0;
async function updateLivingStatus() {
    while (true) {
        console.log(currentVisitors)
        if (currentVisitors > 0) {
            console.log("turble lives! ")
            if (IS_DEAD) {
                IS_DEAD = false;
                INIT_TIME = new Date().getTime()
            }
            TIME_ALIVE = new Date().getTime() - INIT_TIME
            RECORD_TIME = Math.max(RECORD_TIME, TIME_ALIVE)
        } else {
            console.log("turble died :( ")
            if (!IS_DEAD) {
                RECORD_TIME = Math.max(RECORD_TIME, TIME_ALIVE)
                TIME_ALIVE = 0;
                IS_DEAD = true;   
                await sleep(5000);
            }

        }
        await sleep(250);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

updateLivingStatus(); 
