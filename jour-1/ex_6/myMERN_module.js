var fs = require("fs");

exports.create = function (name) {
    fs.writeFile(name, name, function (err) {
        if (err) console.log("Create " + name + " : KO");
        console.log("Create " + name + " : OK")
    })
}

exports.read = function (name) {
    fs.readFile(name,
        function (err, data) {
            if (err) console.log("Read " + name + " : KO")
            console.log(data.toString('utf8'))
        })
}


exports.update = function (name, update) {
    fs.writeFile(name, update, function (err) {
        if (err) console.log("Update " + name + " : KO");
        console.log("Update " + name + " : OK");

    });
};

exports.delete = function (name) {
    fs.unlink(name, function (err) {
        if (err) console.log("Delete " + name + " : KO")
        console.log("Delete " + name + " : OK");
    });
}

// var myMERN_module = require('./myMERN_module.js');