const express = require("express")
const app = express()
const url = require('url');
const querystring = require('querystring')

app.get('/name/:name', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ex_5</title></head></><body><h1>Hello ${req.params.name}, you have ${req.query.age} yo</h1></body></html>`);
})

app.listen(4242)