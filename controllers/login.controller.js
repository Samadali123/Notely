const notesModel = require('../models/notes');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userModel = require("../models/users");

const secretKey = process.env.JWT_SECRET_KEY;

const Login = async(req, res, err) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (!user) return res.status(err.status || 500).render("server");

    bcrypt.compare(password, user.password, function(err, result) {
        if (err) {
            res.status(err.status || 500).json({ success: false, message: err.message })
        } else {
            if (result) {
                let token = jwt.sign({ email: user.email, userid: user._id }, secretKey);
                res.cookie("token", token)
                res.status(401).redirect("/Notely/home")

            } else res.status(400).render("loginError");
        }

    });


}


module.exports = Login;