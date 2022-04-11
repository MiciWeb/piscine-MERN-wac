const express = require("express")

const app = express()

app.get("/", (res, req) => {
    req.send("Great ! It works")
})
app.listen(4242)