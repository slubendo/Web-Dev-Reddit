const express = require("express");
const router = express.Router();
const db = require("../fake-db")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');


router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }));

// Comments

router.get('/show/:commentid', (req, res) => {
    let givenUsername = req.session.username;
    let commentid = req.params.commentid
    let users = db.users
    let comments = db.comments

    let commentShow = {}
    for (let comment in comments) {
        if ((comments[comment].id) == commentid) {
            commentShow = comments[comment]
        }
    }

    res.render('commentShow', {
        username: givenUsername,
        users: users,
        commentShow: commentShow,
        comments: db.comments,
        commentid: commentid,
        calc: db.calc,
        findDate: db.findDate,

    })
})

router.post('/reply/:commentid', (req, res) => {
    let givenUsername = req.session.username;
    let commentid = req.params.commentid
    let users = db.users
    const creator = db.getUserByUsername(givenUsername).id
    const description = req.body.description
    // const comments = db.comments
    let comments = db.comments

    let commentShow = {}
    for (let comment in comments) {
        if ((comments[comment].id) == commentid) {
            commentShow = comments[comment]
        }
    }
console.log(commentShow.creator)
    const userAll = []
    for (const user in db.users) {
        userAll.push(db.users[user].uname)
    }

    // Security to only allow users in database to comment
    if (userAll.includes(req.session.username)) {
        console.log("User is in database, allow user to comment")
        db.addComment(commentid, creator, description)
        res.redirect(`/comments/show/${commentid}`)
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }

  res.redirect(`/comments/show/${commentid}`)
})


router.get('/edit/:commentid', (req, res) => {
    let givenUsername = req.session.username;
    let commentid = req.params.commentid
    let users = db.users
    let comments = db.comments

    let commentShow = {}
    for (let comment in comments) {
        if ((comments[comment].id) == commentid) {  
            commentShow = comments[comment]
        }
    }

    const currentUser = users[commentShow.creator].uname
    // Backend Security
    if (req.session.username == currentUser) {

        res.render('commentEdit', {
            username: givenUsername,
            users: users,
            commentShow: commentShow,
            comments: db.comments,
            commentid: commentid,
            calc: db.calc,
            findDate: db.findDate,
        })
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }
})

router.post('/edit/:commentid', (req, res) => {
  const commentid = req.params.commentid
  let description = req.body.description
  
  db.editComment(commentid, description)
  res.redirect(`/comments/show/${commentid}`)
})


router.get('/deleteconfirm/:commentid', (req, res) => {
    let givenUsername = req.session.username;
    let commentid = req.params.commentid
    let users = db.users
    let comments = db.comments

    let commentShow = {}
    for (let comment in comments) {
        if ((comments[comment].id) == commentid) {  
            commentShow = comments[comment]
        }
    }

    const currentUser = users[commentShow.creator].uname
    // Backend Security
    if (req.session.username == currentUser) {

        res.render('commentDeleteConfirm', {
            username: givenUsername,
            users: users,
            commentShow: commentShow,
            comments: db.comments,
            commentid: commentid,
            calc: db.calc,
            findDate: db.findDate,
        })
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }  
})


router.post('/delete/:commentid', (req, res) => {
  let givenUsername = req.session.username;
  const commentid = req.params.commentid
  let users = db.users
  let comments = db.comments
  let body = Object.keys(req.body)
  let postShow = comments[commentid].post_id

  const currentUser = users[comments[commentid].creator].uname

  // Backend Security
  if (req.session.username == currentUser) {

      if (body.includes('delete')) {
          db.deleteComment(commentid)
          if(postShow > 5000) {
              res.redirect(`/comments/show/${postShow}`)
          } else {
            res.redirect(`/posts/show/${postShow}`)
          }
      } else {
          res.redirect(`/comments/show/${commentid}`)
      }
  } else {
      console.log("failure, might be a hacker")
      res.redirect(`/`)
  }
  res.redirect(`/comments/show/${commentid}`)
})




module.exports = router