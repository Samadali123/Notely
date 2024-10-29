const notesModel = require("../models/notes")
const userModel = require("../models/users")

const nodemailer = require("nodemailer")
require("dotenv").config();

const getBaseUrl = () => {
    return process.env.NODE_ENV === 'production'
      ? process.env.PROD_BASE_URL
      : process.env.DEV_BASE_URL;
  };

  const generateResetPasswordUrl = () => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/Notely/resetpassword`;
  };


  const forgotpassword = async (req, res, next) => {
    const { email } = req.body;
    const User = await userModel.findOne({ email });

    if (!User) {
        return res.status(403).render("server");
    } else {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.Email,
                pass: process.env.Password // Ensure this is your App Password
            }
        });

        const mailOptions = {
            from: process.env.Email,
            to: email,
            subject: 'Forgot your Notely Password? Reset now using the link below',
            html: `
              <a style="color: royalblue; font-size: 18px; font-weight: 600; text-decoration: none;" 
                 href="${generateResetPasswordUrl()}">
                Reset Password
              </a>
            `,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return res.json({ success: false, message: error.message });
            }
            res.redirect("/Notely/Email/sent/successfully");
        });
    }
};




module.exports = forgotpassword;