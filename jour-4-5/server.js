var express = require("express")
var app = express()
var port = 4242
var bodyParser = require('body-parser');
var path = require("path")
var sha1 = require('sha1')
var cors = require('cors')
var uniqid = require("uniqid")
const date = require('date-and-time');
var ObjectId = require('mongodb').ObjectId;

app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))

var MongoClient = require('mongodb').MongoClient
var db

MongoClient.connect(
    "mongodb://localhost:27042/mern-pool",
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
        db = client.db()
        app.listen(port, () => {
            console.log("server started at http://localhost:" + port)
        })
    }
)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

app.use(cors())

app.post("/register", (req, res) => {
    // check if email or login already exist then insert to database
    db.collection("users").find({ $and: [{ email: req.body.email }] }).toArray(function (err, data) {
        var mail = [];
        data.forEach(element => {
            mail.push(element.email)
        });
        if (mail.length > 0) {
            res.status(400).json("Email already taken !")
        } else {
            db.collection("users").find({ $and: [{ login: req.body.login }] }).toArray(function (err, data) {
                var login = [];
                data.forEach(element => {
                    login.push(element.login)
                });
                if (login.length > 0) {
                    res.status(400).json("Login already taken !")
                } else {
                    db.collection('users').insertOne({
                        _id: Math.floor(Math.random() * 100000000),
                        login: req.body.login,
                        email: req.body.email,
                        password: sha1(req.body.password),
                        type: false
                    }, function (err) {
                        if (err) {
                            res.status(400).json("There is an error in the fields !")
                            res.end()
                        } else {
                            res.status(200).json("You can now login !");
                            res.end()
                        }
                    });

                }
            })
        }
    })
})

app.post("/login", (req, res) => {
    db.collection("users").find({ $and: [{ login: req.body.login }, { password: sha1(req.body.password) }] }).toArray(function (err, data) {
        if (err) throw err;
        if (data[0]) {
            res.status(200).json(req.body.login);
        } else {
            res.status(400).json("Login and password doesnt match")
        }
    })
})

app.get("/tickets", (req, res) => {
    db.collection("tickets").find().sort({ _id: -1 }).toArray(function (err, data) {
        if (err) throw err;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(400).json("error when fetching")
        }
    })
})

app.get("/comments", (req, res) => {
    db.collection("comments").find().sort({ _id: -1 }).toArray(function (err, data) {
        if (err) throw err;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(400).json("error when fetching")
        }
    })
})

app.post("/comments", (req, res) => {
    db.collection('comments').insertOne({
        ticketid: req.body.id,
        user: req.body.user,
        comment: req.body.comment,
    }, function (err) {
        res.status(200);
    })
})

app.post("/tickets", (req, res) => {
    db.collection('tickets').insertOne({
        id_user: req.body.welcome,
        title: req.body.title,
        body: req.body.body,
        category: req.body.category,
    }, function (err) {
        res.status(200);
    })
})

app.post("/update/tickets", (req, res) => {
    var o_id = new ObjectId(req.body.id);
    db.collection("tickets").updateOne({
        _id: o_id
    }, {
        $set: {
            id_user: req.body.welcome,
            title: req.body.title,
            body: req.body.body,
            category: req.body.category
        }
    }, function (err) {
        res.status(200);
    })
})

app.post("/delete/tickets", (req, res) => {
    var o_id = new ObjectId(req.body.id);

    db.collection('tickets').deleteOne({
        _id: o_id,
    }, function (err) {
        res.status(200);
    })
})

app.post("/delete/comments", (req, res) => {
    var o_id = new ObjectId(req.body.id);

    db.collection('comments').deleteOne({
        _id: o_id,
    }, function (err) {
        res.status(200);
    })
})

app.get("/users", (req, res) => {
    db.collection("users").find().toArray(function (err, data) {
        if (err) throw err;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(400).json("error when fetching")
        }
    })
})