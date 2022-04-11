var express = require("express");
var app = express();
var port = 4242;
var bodyParser = require('body-parser');
app.set("view engine", "ejs")
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

    User.find(
        (err, result) => {
            if (err) throw err;
            if (result) {
                res.render(__dirname + "/views/index", { result: result })
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        })
})
app.post("/search", (req, res) => {

    var filter = req.body.filter

    var User = mongoose.model("User", nameSchema);
    
    User.find({
        // lastname: filter,
        $or:[{firstname: filter},{lastname:filter},{email:filter},{phone:filter}]
    },
        (err, result) => {
            if (err) throw err;
            if (result) {
                res.render(__dirname + "/views/search", { result: result })
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        })
});

app.post("/sort", (req, res) => {
    var sort = req.body.sort
    var User = mongoose.model("User", nameSchema);

    User.find(
        (err, result) => {
            if (err) throw err;
            if (result) {
                res.render(__dirname + "/views/sort", { result: result })
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        }).collation({locale:'en',strength: 2}).sort({lastname:sort})
});

app.post("/add", (req, res) => {
    var User = mongoose.model("User", nameSchema);

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

app.post("/delete", (req, res) => {
    var del = req.body.delete
    var User = mongoose.model("User", nameSchema);
    console.log(del)

    User.deleteOne({ email: del },
        (err, result) => {
            if (err) throw err;
            if (result) {
                res.send(del + " has been deleted !")
            } else {
                res.send(JSON.stringify({
                    error: 'Error'
                }))
            }
        })
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});