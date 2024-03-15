const express = require("express");
const router = express.Router();
const db = require("../fake-db")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');


router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }));


app.get("/debug", (req, res) => {
    // See if you can figure out what this route is for.
    // Are you clever enough to benefit from it?
    // Did you even read this comment?Read
    db.debug();
    res.redirect("/")
  })

module.exports = router