const express = require("express")
const app = express()

app.get("/name/", (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ex_4</title></head></><body><h1>Hello unknown</h1></body></html>`);
})

app.get('/name/:name', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ex_4</title></head></><body><h1>Hello ${req.params.name} </h1></body></html>`);
})

app.listen(4242)