var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;

var router = express.Router();

//require the routes file to pass through above router object
require("./config/routes")(router);

//Designates the public folder
app.use(express.static(__dirname + "/public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//every request goes through express.Router() middleware
app.use(router);

//set up body parser - values can be only strings or arrays
app.use(bodyParser.urlencoded({
  extended: false
}));

//MONGOOSE SETUP
//If deployed, use that database else use mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Connect Mongoose to db
mongoose.connect(MONGODB_URI);
// //If deployed, use that database else use mongoHeadlines database
// var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// // Connect Mongoose to db
// mongoose.connect(db, error => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("mongoose connecton successful");
//   }
// });

//Listen on PORT...
app.listen(PORT, function() {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});
