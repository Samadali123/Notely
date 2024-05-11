require("dotenv").config({ path: "./.env" });
const express = require(`express`)
const app = express();
const path = require('path');
const usersRouter = require(`./routes/userRoutes`);
const cookieParser = require("cookie-parser")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
// setting a database connection
require("./models/dbconfig").dbconnection();



app.use(session({
    secret: process.env.GOOGLE_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        autoRemove: 'disabled'
    }),
}));


app.use(passport.authenticate('session'));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});


passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});


//setting a view engine and static files.
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")));

// logger for a route hit information in the backend
const logger = require(`morgan`);
app.use(logger('tiny'));


//body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// active cookie-parser for reading a cookie in the backend
app.use(cookieParser());


// base uri for user routes
app.use(`/`, usersRouter);


// unknown routes
app.all("*", function(req, res, next) {
    res.status(404).json({
        success: false,
        message: `${req.url} Not found `
    });
})


app.listen(process.env.PORT, () => {
    console.log(`server started running on port ${process.env.PORT}`);
})