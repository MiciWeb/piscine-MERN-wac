var express = require("express");
var app = express();
var port = 4242;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27042/mern-pool");
var nameSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    email: String,
    validated: { type: String, default: 'in progress' },
    admin: { type: Boolean, default: false }
}, { collection: 'students' });
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/add", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(() => {
            res.send("Collection saved");
            res.end()
        })
        .catch((err) => {
            res.status(400).send("Failed to save to connection");
            res.end()
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});