const http = require('http');
const express = require('express');
/* const MongoClient = require('mongodb');
const DB_URL='mongodb://admin:admin@localhost:27017/?authMechanism=SCRAM-SHA-1&authSource=currentVisitors'
 */
const app = express();
app.use(express.static('assets'));
app.set('view engine', 'pug');
app.set('views','./views');

app.get('/', function(req, res){
    res.render('murp', {
        isDead: IS_DEAD,
    });
});

const server = http.createServer(app);

var io = require('socket.io')(server);
io.on('connection', (socket) => {
    //console.debug('a user connected: num of sockets', io.sockets.sockets.size);
    socket.on('disconnect', () => {
        //console.debug('user disconnected');
        //console.log('after disconnect:', io.sockets.sockets.size)
    });
});

const port = 80;
server.listen(port);
console.debug('Server listening on port ' + port);

/* 
const dbName = 'currentVisitors';
const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true });
const db = client.db(dbName);
const collection = await db.collection('currentVisitors');
 */

var IS_DEAD = true;
async function updateLivingStatus() {
    while (true) {
        var currentVisitors = io.sockets.sockets.size
        if (currentVisitors > 0) {
            IS_DEAD = false;
        } else {
            IS_DEAD = true;
        }
        await sleep(3000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

updateLivingStatus();