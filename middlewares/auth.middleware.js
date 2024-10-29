const jwt = require("jsonwebtoken")
const { config } = require('dotenv');
//call the environment varibles set in  env
config();


const secretKey = process.env.JWT_SECRET_KEY;

function IsLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).render("isloggedin");

    }

    try {
        const data = jwt.verify(token, secretKey);
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).render("isloggedin")
    }
}



module.exports = IsLoggedIn;