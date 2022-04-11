const express = require("express")
const app = express()

var myMERN_module = require('./myMERN_module.js')

app.get("/files/:name", (req, res) => {
    res.send(myMERN_module.read(req.params.name))
})
app.post("/files/:name", (req, res) => {
    res.send(myMERN_module.create(req.params.name))
})
app.put("/files/:name/:content", (req, res) => {
    res.send(myMERN_module.update(req.params.name, req.params.content))
})
app.delete("/files/:name", (req, res) => {
    res.send(myMERN_module.delete(req.params.name))
})

app.listen(4242)