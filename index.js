var eXPress = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    exphbs = require("express-handlebars"),
    app = eXPress();

var XP = require("./xp");
var prettyDate = require("./prettyDate.js");

app.use(logger("dev"));
app.use(eXPress.static(__dirname + "/static"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", function(req, res, next) {
    res.render("index");
});

app.post("/result", function(req, res, next) {
    //TODO error handling
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
        var milliSecondsPerDay = 1000 * 60 * 60 * 24;
        var milliSecondsPerYear = milliSecondsPerDay * 365;

        var missingYears = Math.floor(milliSecondsTill40 / milliSecondsPerYear);
        var missingDays = Math.floor((milliSecondsTill40 % (missingYears * milliSecondsPerYear)) / milliSecondsPerDay);
        
        res.render("result", {
            finalDate: prettyDate.print(finalDate),
            xpGained: xpGained,
            xpGainedPercentage: xpGained * 100 / XP[40],
            missingXP: XP[40] - xpGained,
            missingXPinPokemon: (XP[40] - xpGained) / 100,
            missingYears: (missingYears + "0").charAt(0),
            missingDays: missingDays
        });
    } catch (e) {
        console.log(e);
        res.send("An error occured while calculating the time needed for you to reach level 40.");
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on http://localhost:" + (process.env.PORT || 3000));
});
