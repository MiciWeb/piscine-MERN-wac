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


app.get("/", (req, res) => {
    var User = mongoose.model("User", nameSchema);

    User.find({
        validated: "in progress",
    },
        (err, result) => {
            if (err) throw err;
            if (result) {
                res.json(result)
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        }).collation({locale:'en',strength: 2}).sort({lastname:-1})

});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});