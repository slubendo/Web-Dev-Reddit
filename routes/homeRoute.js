const express = require("express");
const router = express.Router();
const db = require("../fake-db")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');


router.use(cookieParser())
router.use(bodyParser.urlencoded({ extended: false }));

router.use(cookieSession({
    name: 'session',
    keys: ['username'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// console.log(db.getPost(102))


// Home
router.get('/', (req, res) => {
    let givenUsername = req.session.username;
    let postid = req.params.postid

    // Already sorted
    let posts = db.getPosts()
    let users = db.users

    res.render('index', {
        username: givenUsername,
        posts: posts,
        users: users,
        postid: postid,
        calc: db.calc,
        findDate: db.findDate,
    })

})

router.post("/",(req,res) => {
    let givenUsername = req.session.username;
    let postid = req.params.postid
    let body = Object.keys(req.body)

    // Already sorted
    let posts = db.getPosts()
    let users = db.users
    
    if (body.includes("like")) {
        console.log("hey")
        res.render('index', {
            username: givenUsername,
            posts: db.sortVote(),
            users: users,
            postid: postid,
            calc: db.calc,
            findDate: db.findDate,
        })
    } else {
        console.log("hi")
    
        res.render('index', {
            username: givenUsername,
            posts: posts,
            users: users,
            postid: postid,
            calc: db.calc,
            findDate: db.findDate,
        })
    }    
})


// Auth/ Login 
router.get("/login", (req, res) => {
    res.render("login", {})
})

router.post('/login', (req, res) => {
    let givenUsername = req.body.username;
    let givenPassword = req.body.password;
    let foundUser = db.getUserByUsername(givenUsername);

    if (foundUser && givenPassword === foundUser.password) {

        console.log(`login attempt from user ${givenUsername}, SUCCESS`)
        req.session.username = givenUsername;

        res.redirect('/')

    } else {
        console.log(`login attempt from user ${givenUsername}, failure, might be a hacker`)
        // window.alert("Invalid Login")
        res.clearCookie("whoami")
        res.redirect('/login')


    }

})

router.post('/logout', (req, res) => {
    req.session = null
    res.redirect('/')
})

// SignUP 

router.get('/signup', (req, res) => {
    res.render('signUp')
})

router.post('/signup', (req, res) => {
    let givenUsername = req.body.username;
    let givenPassword = req.body.password;

    db.addUser(givenUsername, givenPassword)
    console.log(`User ${givenUsername} created, SUCCESS`)
    console.log(db.users)
    // Log new User in 
    req.session.username = givenUsername;
    res.redirect('/')
})

module.exports = router