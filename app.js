require("dotenv").config({ path: "./.env" });
const express = require(`express`)
const app = express();
const path = require('path');
const usersRouter = require(`./routes/userRoutes`);

// setting a database connection
require("./models/dbconfig").dbconnection();



//setting a view engine and static files.
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")));

// logger for a route hit information in the backend
const logger = require(`morgan`);
app.use(logger('tiny'));


//body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


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