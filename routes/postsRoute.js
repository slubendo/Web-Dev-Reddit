const express = require("express");
const router = express.Router();
const db = require("../fake-db")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');


router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }))

// individual posts
router.get('/show/:postid', (req, res) => {
    let givenUsername = req.session.username;
    let postid = req.params.postid
    let posts = db.getPosts()
    let users = db.users

    let postShow = {}
    for (let post of posts) {
        if (post.id == postid) {
            postShow = db.getPost(post.id)
        }
    }

    res.render('postShow', {
        username: givenUsername,
        postid: postid,
        users: users,
        postShow: postShow,
        comments: db.comments,
        calc: db.calc,
        findDate: db.findDate,

    })
})

router.get('/create', (req, res) => {
    let givenUsername = req.session.username;

    res.render('postCreate', {
        username: givenUsername,
    })

})

router.post('/create', (req, res) => {
    let givenUsername = req.session.username;
    let getUser = db.getUserByUsername(givenUsername)

    let newPost = db.addPost(req.body.title, req.body.link, getUser.id, req.body.description, req.body.subgroup)
    let postid = newPost.id

    res.redirect(`/posts/show/${postid}`)
})

router.get('/edit/:postid', (req, res) => {
    let givenUsername = req.session.username;
    let postid = req.params.postid
    let posts = db.getPosts()
    let users = db.users
    const currentUser = db.getPost(postid).creator.uname


    let postShow = {}

    for (let post of posts) {
        if (post.id == postid) {
            postShow = db.getPost(post.id)
        }
    }
    // Backend Security

    if (req.session.username == currentUser) {

        res.render('postEdit', {
            username: givenUsername,
            postid: postid,
            users: users,
            postShow: postShow,
            calc: db.calc,
            findDate: db.findDate,
        })
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }
})

router.post('/edit/:postid', (req, res) => {
    let postid = req.params.postid

    let changes = {
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
        subgroup: req.body.subgroup,
    }

    db.editPost(postid, changes)
    res.redirect(`/posts/show/${postid}`)
})

router.get('/deleteconfirm/:postid', (req, res) => {
    let givenUsername = req.session.username;
    let postid = req.params.postid
    let posts = db.getPosts()
    let users = db.users
    let postShow = {}
    const currentUser = db.getPost(postid).creator.uname
    console.log(currentUser)
    for (let post of posts) {
        if (post.id == postid) {
            postShow = db.getPost(post.id)
        }
    }

    // Backend Security
    if (req.session.username == currentUser) {
        res.render('postDeleteConfirm', {
            username: givenUsername,
            postid: postid,
            users: users,
            postShow: postShow,
            calc: db.calc,
            findDate: db.findDate,
        })

    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }

})

router.post('/delete/:postid', (req, res) => {
    const postid = req.params.postid
    let body = Object.keys(req.body)
    let posts = db.posts;
    const currentUser = db.getPost(postid).creator.uname
    let postDeleteSub = posts[postid].subgroup


    // Backend Security
    if (req.session.username == currentUser) {

        if (body.includes('delete')) {
            db.deletePost(postid)
            res.redirect(`/subs/show/${postDeleteSub}`)
        } else {
            res.redirect(`/posts/show/${postid}`)
        }
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }
})

router.post('/comment-create/:postid', (req, res) => {
    let givenUsername = req.session.username;
    let postid = req.params.postid
    let posts = db.getPosts()
    let users = db.users
    const creator = db.getUserByUsername(givenUsername).id
    const description = req.body.description
    const comments = db.comments

    const userAll = []
    for (const user in db.users) {
        userAll.push(db.users[user].uname)
    }

    // Security to only allow users in database to comment
    if (userAll.includes(req.session.username)) {
        console.log("User is in database, allow user to comment")
        db.addComment(postid, creator, description)
        res.redirect(`/posts/show/${postid}`)
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }
})


router.post('/voteup/:postid', (req, res) => {
    const postid = req.params.postid
    let givenUsername = req.session.username;
    const userAll = []

    for (const user in db.users) {
        userAll.push(db.users[user].uname)
    }

    // Security to only allow users in database to vote
    if (userAll.includes(req.session.username)) {
        console.log("User is in database, allow user to up vote")
        db.addVote(givenUsername, postid, "+1")
        res.redirect('/')
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }
})

router.post('/votedown/:postid', (req, res) => {
    const postid = req.params.postid
    let givenUsername = req.session.username;
    const userAll = []

    for (const user in db.users) {
        userAll.push(db.users[user].uname)
    }

    // Security to only allow users in database to vote
    if (userAll.includes(req.session.username)) {
        console.log("User is in database, allow user to down vote")
        db.addVote(givenUsername, postid, "-1")
        res.redirect('/')
    } else {
        console.log("failure, might be a hacker")
        res.redirect(`/`)
    }
})


module.exports = router