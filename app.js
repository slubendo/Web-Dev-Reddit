const express = require("express");
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session");
const db = require("./fake-db")
const cookieParser = require('cookie-parser');
const { title } = require("process");
const { post } = require("jquery");
const path = require("path")
const postsRoute = require("./routes/postsRoute")
const commentsRoute = require("./routes/commentsRoute")
const subsRoute = require("./routes/subsRoute")
const homeRoute = require("./routes/homeRoute")
const debugRoute = require("./routes/homeRoute")
const app = express();

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use("/", homeRoute)
app.use("/subs", subsRoute)
app.use("/posts", postsRoute)
app.use("/comments", commentsRoute)
app.use("/debug", debugRoute)


const PORT = 8000;




app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))