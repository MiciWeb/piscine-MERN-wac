const express = require('express')
const app = express()
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27042/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };
});

app.listen(4242);