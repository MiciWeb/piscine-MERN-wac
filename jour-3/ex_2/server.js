var express = require("express");
var app = express();
var port = 4242;
var bodyParser = require('body-parser');
var path = require("path")
var sha1 = require('sha1');

app.set("view engine", "ejs")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect(
    "mongodb://localhost:27042/mern-pool",
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
        db = client.db()
        app.listen(port)
    }
)

app.get("/register", (req, res) => {
    res.render("register", { error: "" })
})

app.post("/register", (req, res) => {
    db.collection("users").find({ $and: [{ email: req.body.email }] }).toArray(function (err, data) {
        var mail = [];
        data.forEach(element => {
            mail.push(element.email)
        });
        if (mail.length > 0) {
            res.status(400).render('register', { error: "Email already taken !" })
        } else {
            db.collection("users").find({ $and: [{ login: req.body.login }] }).toArray(function (err, data) {
                var login = [];
                data.forEach(element => {
                    login.push(element.login)
                });
                console.log(login.length)
                if (login.length > 0) {
                    res.status(400).render('register', { error: "Login already taken !" })
                } else {
                    if (req.body.password !== req.body.password2) {
                        res.status(400).render('register', { error: "Password dont match !" })
                    } else {
                        db.collection('users').insertOne({
                            _id: Math.floor(Math.random() * 1000000),
                            login: req.body.login,
                            email: req.body.email,
                            password: sha1(req.body.password),
                            type: false
                        }, function (err, inserted) {
                            if (err) {
                                res.status(400).render('register', { error: 'There is an error in the fields !' })
                                res.end()
                            } else {
                                res.status(200).render("index", { error: req.body.login });
                            }
                        });
                    }
                }
            })
        }
    })

})

app.get('/login', function (req, res) {
    res.render('login', { error: "" })
})

app.post("/login", (req, res) => {
    db.collection("users").find({ $and: [{ email: req.body.email }, { password: sha1(req.body.password) }] }).toArray(function (err, data) {
        if (err) throw err;
        if (data[0]) {
            res.status(200).render("index", { error: data[0]["login"] });
        } else {
            res.status(400).render('login', { error: "Login and password doesnt match" });
        }
    })
})
