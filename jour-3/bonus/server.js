var express = require("express");
var app = express();
var port = 4242;
var bodyParser = require('body-parser');
var path = require("path")
var sha1 = require('sha1');
var ObjectId = require('mongodb').ObjectID;

app.set("view engine", "ejs")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

var MongoClient = require('mongodb').MongoClient;
var db;

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));

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
        // var login = [];
        data.forEach(element => {
            mail.push(element.email)
            // login.push(element.login)
            // console.log(element)
        });
        // console.log(login.length)
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
                                res.status(200).render("login", { error: "You can now login !" });
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
            req.session.user = data[0]["login"];
            req.session.save();
            res.render('shop', { error: "Hello", products: [] });
            res.end()
        } else {
            res.status(400).render('login', { error: "Login and password doesnt match" });
        }
    })
})

app.post("/shop", (req, res) => {
    if (req.session.user != undefined) {
        db.collection("products").find({ $or: [{ titre: req.body.bonus }, { description: req.body.bonus }] }).toArray(function (err, data) {
            res.render('shop', { error: "Here is your product", products: data });
        })
    } else {
        res.status(200).render("shop", { error: "<br>You are not connected", products:"" });
    }
})

app.get('/shop/:id', function (req, res) {
    if (req.session.user != undefined) {
        db.collection("products").find({ _id: ObjectId(req.params.id) }).toArray(function (err, results) {
            console.log(results)
            res.render('shop', { error: "Here is your product", products: results });
        })
    } else {
        res.send("vous n'etes pas co")
    }
});

app.get("/admin/add/product", (req, res) => {
    if (req.session.user != undefined) {

        db.collection("users").find({ login: req.session.user }).toArray(function (err, data) {
            if (err) throw err;
            if (data[0].type == true) {
                res.render("add")
            } else {
                res.status(400).render("adminerror")
            }
            // res.status(200).render("add", { error: "Welcome " + req.session.user + "<h3 style='text-align:center;margin-top:30px;margin-bottom:11px'>All products:</h3>", products: data });
        })

        // db.collection("products").find({}).toArray(function (err, data) {
        //     if (err) throw err;
        //     res.status(200).render("add", { error: "Welcome " + req.session.user + "<h3 style='text-align:center;margin-top:30px;margin-bottom:11px'>All products:</h3>", products: data });
        // })

    } else {
        res.status(200).render("shop", { error: "<br>You are not connected" });
    }
})

app.post("/admin/add/product", (req, res) => {
    db.collection("products").insertOne({
        titre: req.body.titre,
        description: req.body.description,
        prix: parseInt(req.body.prix),
        categorie: req.body.categorie,
    }, function (err, inserted) {
        if (err) {
            res.send("error when adding, try again")
        } else {
            res.redirect(307, '/shop');
            res.end()
        }
    });
})

app.get("/admin/add/categorie", (req, res) => {
    res.render("addcategorie")
})

app.post("/admin/add/categorie", (req, res) => {
    console.log(req.body)
    console.log("oui")
    db.collection("categorie").insertOne({
        categorie: req.body.categorie,
    }, function (err, inserted) {
        if (err) {
            res.send("error when adding, try again")
        } else {
            res.redirect(307, '/shop');
            res.end()
        }
    });
})
