// server.js
var express = require('express');
var app = express();

var fs = require('fs');
var Promise = require('promise');

var port = process.env.PORT || 8080;
var router = express.Router();

//router to handle callback
router.get('/callback', function(req, res) {
    var callback = function(err, data){
        if(err){
            res.status(500);
            res.send({error: '500 Internal Server Error!'});
            return console.error(err);
        }
        res.status(200);
        res.send({message: 'Hello Callback!'});
        console.log(JSON.parse(data));
    };
    fs.readFile('shoes.json', callback);
});

//router to handle promise
router.get('/promise', function(req, res) {
    var readFile = function(){
        return new Promise(function(resolve, reject){
            fs.readFile('shoes.json', function(err, data){
                return err ? reject(err) : resolve(data);
            });
        });
    };

    readFile()
        .then(function(data){
            res.status(200);
            res.send({message:'Hello Promise!'});
            console.log(JSON.parse(data));
        })
        .catch(function (err) {
            res.status(500);
            res.send({error: '500 Internal Server Error!'});
            console.log(err);
        });
});

app.use('/sample', router);

//start server
var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});


/*
 Notes on callbacks vs. promises
 =========================================================================
 * all operations that involve IO should be asynchronous. This can be done simply using a callback
 * using callbacks can lead to nested callbacks and messier code pyramids.
 * a promise represents the result of an asynchronous operation
 * a promise is pending, fulfilled, or rejected (fulfillment value and rejection reason)
 * promises help handle errors and write cleaner code by not having callback parameters.
 * a promise provides access to a value representing the asynchronous operation (the promise). We can pass the promise around and anyone with access to the promise can consume it using then regardless if the asynchronous operation has completed or not

 */