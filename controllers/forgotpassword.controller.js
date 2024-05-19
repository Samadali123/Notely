const notesModel = require("../models/notes")
const userModel = require("../models/users")

const nodemailer = require("nodemailer")
require("dotenv").config();


const forgotpassword = async(req, res, next) => {

    const { email } = req.body;
    const User = await userModel.findOne({ email })

    if (!User) {
        return res.status(403).render("server");
    } else {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.Email,
                pass: process.env.Password
            }
        });


        var mailOptions = {
            from: process.env.Email, // Use the email you want to send from
            to: email, // Make sure this field matches the recipient's email
            subject: `Forget your Notely Password? Reset now using link given below`,
            html: `
                    <a style="color: royalblue; font-size:18px; font-weight:600; text-decoration:none;" href="http://localhost:8080/Notely/resetpassword">Reset Password</a>
                `
        }


        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return res.send(error)
            }
            res.redirect("/Notely/Email/sent/successfully");
        })
    }


}


module.exports = forgotpassword;