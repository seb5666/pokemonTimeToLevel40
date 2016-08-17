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
    console.log(req.body);
    try {
        var level = +req.body.level;
        var currentXP = +req.body.currentXP;
        var startDate = new Date(req.body.startDate);
       
        if (level === 40) {
            res.render("error", {
                errorMessage: "Congratulations, you are already level 40!" 
            });
            return;
        }
        
        var now = new Date();

        if (level < 1 || level > 39 || currentXP < 0 || currentXP > XP[level] || startDate.getFullYear() < 2016 || startDate > now) {
            res.render("error", {
                errorMessage: "Some inputs were invalid on the form. Verify that the level is between 1 and 40 and that the current XP is correct." 
            });
            return;
        }

        var xpGained= currentXP + XP[level]
        var xpPerMilliSecond = xpGained / (now - startDate);
        var milliSecondsTill40 = (XP[40] - xpGained) / xpPerMilliSecond;
        var finalDate = new Date(now.getTime() + milliSecondsTill40);
        
        if (isNaN(finalDate.getTime())) {
            res.render("error", {
                errorMessage: "Sorry, but you will be long dead by the time you reach level 40."
            });
            return;
        }
        
        var milliSecondsPerDay = 1000 * 60 * 60 * 24;
        var milliSecondsPerYear = milliSecondsPerDay * 365;

        var missingYears = Math.floor(milliSecondsTill40 / milliSecondsPerYear);
        var missingDays = (missingYears > 0) ? Math.floor((milliSecondsTill40 % (missingYears * milliSecondsPerYear)) / milliSecondsPerDay) :  Math.floor(milliSecondsTill40 / milliSecondsPerDay);
        console.log(milliSecondsTill40);
        console.log(missingYears);
       console.log(missingDays); 
        res.render("result", {
            finalDate: prettyDate.print(finalDate),
            xpGained: xpGained.toLocaleString(),
            xpGainedPercentage: xpGained * 100 / XP[40],
            missingXP: (XP[40] - xpGained).toLocaleString(),
            missingXPinPokemon: ((XP[40] - xpGained) / 100).toLocaleString(),
            missingYears: missingYears,
            missingDays: missingDays
        });
    } catch (e) {
        console.log(e);
        res.render("error", {
            errorMessage: "An error occured while calculating the time needed for you to reach level 40."
        });
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on http://localhost:" + (process.env.PORT || 3000));
});
