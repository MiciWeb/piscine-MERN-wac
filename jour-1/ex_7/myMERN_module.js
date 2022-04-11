var fs = require("fs");

exports.create = function (name) {
    fs.writeFile(name, name, function (err) {
        if (err) return "Create " + name + " : KO";
        // ! to fix
        return "Create " + name + " : OK"
    })
}

exports.read = function (name) {
    fs.readFile(name,
        function (err, data) {
            if (err) return "Read " + name + " : KO"
            return data.toString('utf8')
        })
}

exports.update = function (name, update) {
    fs.writeFile(name, update, function (err) {
        if (err) return "Update " + name + " : KO";
        return "Update " + name + " : OK";

    });
};

exports.delete = function (name) {
    fs.unlink(name, function (err) {
        if (err) return "Delete " + name + " : KO"
        return "Delete " + name + " : OK";
    });
}