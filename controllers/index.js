require('dotenv').config()

const cons = require("consolidate");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");


global.otpCheck = undefined;

// Initialize connection to mySQL
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12367447",
  password: "vHENizWluh",
  database: "sql12367447",
  port: 3306,
});

connection.connect(function (err) {
  if (!!err) console.log(err);
  else console.log("Connected");
});

// ================================================================= Index Page

// GET: Login
router.get("/", async function (req, res) {
  try {
    res.render("./index/test");
  } catch (err) {
    throw err;
  }
});

// POST: Login
router.post("/", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  var sql = `SELECT * FROM Account WHERE username="${username}"`;

  connection.query(sql, async (err, row, fields) => {
    try {
      if (await bcrypt.compare(password, row[0].password)) {
        
        const user = {
          user_id: row[0].user_id,
          username: row[0].username,
          role: row[0].role
        }
        console.log(user)
        switch (row[0].role) {
          case "admin":
            const salt = await bcrypt.genSalt(10);
            const otp = Math.floor(
              Math.random() * (9999 - 1000 + 1) + 1000
            ).toString();
            const email = "bamboo.vennus@gmail.com";
            otpCheck = await bcrypt.hash(otp, salt);
            sendMail(email, otp);
            console.log(otp)
            res.render("./index/redirect");
            break;
          case "staff":
            res.redirect('/staff/home')
            break
          case "trainer":

            res.redirect("/tutor/home");
            break;
        }
      } else
        res.render("./index/test", {
          warning: "Incorrect username or password",
        });
    } catch {
      res.status(500).send();
    }
  });
});

router.post("/redirect", async (req, res) => {
  const otpInput = req.body.otpInput;

  if (await bcrypt.compare(otpInput, otpCheck)) {
    res.redirect("/admin/home");
    otpCheck = undefined;
  } else res.render("./index/redirect", { warning: "Invalid OTP" });
});


module.exports = router;
