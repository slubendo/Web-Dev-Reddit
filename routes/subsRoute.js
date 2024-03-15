const express = require("express");
const router = express.Router();
const db = require("../fake-db")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');


router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }));

// Subs
router.get('/list', (req, res) => {
  let givenUsername =  req.session.username;
  let posts = db.getPosts()
  let sub = []

  for (let post of posts) {
    if (!sub.includes(post.subgroup)) {
      sub.push(post.subgroup)
    }
  }

  res.render('subsList', {
    username: givenUsername,
    posts: posts,
    // Sorts alphabetically
    sub: sub.sort(),
  })
})



router.get('/show/:subname', (req, res) => {
  let givenUsername =  req.session.username;
  let subname = req.params.subname
  // Already sorted
  let posts = db.getPosts()
  let users = db.users



  res.render('subShow', {
    username: givenUsername,
    posts: posts,
    subname: subname,
    users: users,
    calc: db.calc,
    findDate: db.findDate,
  })
  return

})

module.exports = router