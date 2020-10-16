// Import framework/Library
const express = require("express");
const engines = require("consolidate");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser'); 

const app = express();
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Create public directory to storing static files
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

// Declare the view engine for the application
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

// Initialize session
app.use(session
  ({
  secret: "hashed-secret-key",
  saveUninitialized:false, 
  resave: false
  }));

// Initialize the controllers for the app
var controllerIndex = require("./controllers/index")
var controllerAdmin = require("./controllers/admin")
var controllerStaff = require("./controllers/staff")
var controllerTutor = require("./controllers/tutor")

// Initialize the controller with its path
app.use("/", controllerIndex)
app.use("/admin", controllerAdmin)
app.use("/staff", controllerStaff)
app.use("/tutor", controllerTutor)

// Initialize the environment port | default port for the server
app.listen(process.env.PORT || 8080, function () {
  console.log("Server running on port 8080");
});
