var express = require("express"),
    logger = require("morgan"),
    app = express();

app.use(logger("dev"));
app.use(express.static(__dirname + "/static"));


app.get("/", function(req, res, next) {
    try {
        res.send("<h1>Hello World");
    } catch(e) {
        next(e);
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on http://localhost:" + (process.env.PORT || 3000));
});
