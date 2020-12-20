const path = require('path');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    console.log("hello there")
    res.sendFile(path.join(__dirname+'/murp.html'));
});

module.exports = router;