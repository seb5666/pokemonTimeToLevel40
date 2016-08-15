var eXPress = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    app = eXPress();

var XP = require("./xp");
var prettyDate = require("./prettyDate.js");

app.use(logger("dev"));
app.use(eXPress.static(__dirname + "/static"));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", function(req, res, next) {
    res.sendFile("static/index.html", {root: __dirname});
});

app.post("/result", function(req, res, next) {
    console.log(req.body);
    try {
        var level = +req.body.level;
        var currentXP = +req.body.currentXP;
        var xpGained= currentXP + XP[level]
        var startDate = new Date(req.body.startDate);
        var now = new Date();
        var xpPerMilliSecond = xpGained / (now - startDate);
        var milliSecondsTill40 = (XP[40] - xpGained) / xpPerMilliSecond;
        var finalDate = new Date(now.getTime() + milliSecondsTill40);
        console.log(now);
        console.log(startDate);
        console.log(xpGained);
        console.log(xpPerMilliSecond);
        console.log(xpPerMilliSecond * 1000 * 60 * 60 * 24);
        console.log(milliSecondsTill40);
        console.log(finalDate);
        res.send("You have earned a total of " + xpGained + " XP  out of " + XP[40] + 
            " which is " + xpGained / XP[40] + "%.\n" +
            "At this pace you will reach level 40 on the " + prettyDate.print(finalDate));
    } catch (e) {
        console.log(e);
        res.send("An error occured while calculating the time needed for you to reach level 40.");
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on http://localhost:" + (process.env.PORT || 3000));
});
