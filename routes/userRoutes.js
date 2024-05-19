const express = require(`express`)
const router = express.Router();
const notesModel = require('../models/notes');
const notes = require('../models/notes');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userModel = require("../models/users");
const GoogleStrategy = require('passport-google-oidc');
const passport = require('passport');
const { config } = require('dotenv');
const { v4: uuidV4 } = require(`uuid`);
const upload = require("../utils/multer");
const IsLoggedIn = require("../middlewares/auth.middleware")
const indexController = require("../controllers/index.controller")
const loginController = require("../controllers/loginpage.controller")
const registeraccount = require("../controllers/regiter.controller")
const loginaccount = require("../controllers/login.controller")
const logout = require("../controllers/logout.controller");
const profilecontroller = require('../controllers/profile.controller');
const home = require("../controllers/home.controller");
const editprofileController = require('../controllers/editprofile.controller');
const createnotespage = require('../controllers/createnotespage.controller');
const addNotesController = require('../controllers/newnotes.controller');
const opennoteController = require('../controllers/opennotes.controller');
const deletenoteController = require('../controllers/deletenote.controller');
const editpage = require('../controllers/editnotepage.controller');
const editnoteController = require('../controllers/editnote.controller');
const nodemailer = require("nodemailer");
const { restart } = require('nodemon');


//call the environment varibles set in  env
config();

const secretKey = process.env.JWT_SECRET_KEY;
// index Api
router.get("/Notely", indexController);

//  login page Api
router.get("/Notely/login", loginController)


// Regiter account Api
router.post("/Notely/registeraccount", registeraccount);


// Login Api
router.post("/Notely/login", loginaccount)

// Login with Google Api
router.get('/login/federated/google', passport.authenticate('google'));

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile', 'email'],
    passReqToCallback: true // Passes req object to the verify callback
}, async function verify(req, issuer, profile, cb) {
    console.log(profile.emails[0].value)
    let user = await userModel.findOne({ email: profile.emails[0].value });
    if (user) {
        const token = jwt.sign({ email: profile.emails[0].value, userid: user._id },
            secretKey, { algorithm: 'HS256', expiresIn: '1h' }
        );

        // Set token as a cookie using res object from request
        req.res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); // Expires in 1 hour

        return cb(null, user);
    } else {

        const salt = await bcrypt.genSalt(10);
        const password = uuidV4();
        const hashedPassword = await bcrypt.hash(password, salt);
        let newUser = await userModel.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword,
        });

        const token = jwt.sign({ email: profile.emails[0].value, userid: newUser._id },
            secretKey, { algorithm: 'HS256', expiresIn: '1h' }
        );


        // Set token as a cookie using res object from request
        req.res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); // Expires in 1 hour

        await newUser.save();
        ``
        return cb(null, newUser)
    }
}));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/Notely/home',
    failureRedirect: '/Notely/login'
}))


//Logout Api
router.get("/Notely/logout", logout)

// Home APi
router.get("/Notely/home", IsLoggedIn, home)

// Profile Api
router.get("/Notely/profile", IsLoggedIn, profilecontroller);


// Edit profile Api
router.post(`/Notely/edit/profile`, IsLoggedIn, upload.single('image'), editprofileController)

//Create Notes page Api
router.get("/Notely/create/notes", IsLoggedIn, createnotespage)


// Make new Notes Api
router.post("/Notely/add/notes", IsLoggedIn, addNotesController)


//Open note Api
router.get('/Notely/opennote/:noteId', IsLoggedIn, opennoteController)


// Delete note Api
router.get("/Notely/deletenote/:noteId", IsLoggedIn, deletenoteController)




router.get("/Notely/editnote/:noteId", IsLoggedIn, editpage)



router.post("/Notely/updatenote/:noteId", IsLoggedIn, editnoteController);



router.get(`/Notely/search/notes`, IsLoggedIn, async(req, res) => {
    try {
        const input = req.query.data;
        const regex = new RegExp(`^${input}`, 'i');
        const notes = await notesModel.find({ title: regex });
        if (notes.length > 0) {
            notes.forEach((note) => {
                let date = note.date;
                let dateObj = new Date(date);
                let monthNames = [
                    '', 'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                let day = dateObj.getDate();
                let month = dateObj.getMonth() + 1;
                let year = dateObj.getFullYear();
                let monthName = monthNames[month];
                let formattedDate = `${monthName} ${day}, ${year}`;
                note.formattedDate = formattedDate;
            });

        }
        res.json(notes);

    } catch (err) {
        res.status(500).render("server");
    }
});




router.get("/Notely/forgotpassword", (req, res, next) => {
    res.render("forgotpassword", )

})


router.post("/Notely/forgotpassword", async(req, res, next) => {

    const { email } = req.body;
    const User = await userModel.findOne({ email })

    if (!User) {
        return res.status(403).json({ success: false, message: "User not found" })
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


})


router.get("/Notely/Email/sent/successfully", (req, res) => {
    res.render("sentmail")
})

router.get('/Notely/resetpassword', (req, res) => {
    res.render("resetpassword")
})



router.post('/Notely/resetpassword', async(req, res) => {
    try {
        const { email, newPassword } = req.body; // Assuming newPassword is sent in the request
        const User = await userModel.findOne({ email });

        if (!User) {
            return res.json({ error: "User not Found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        const updatedUser = await userModel.findOneAndUpdate({ _id: User._id }, // Target the user by ID
            { password: hashedNewPassword }, { new: true }
        );

        // Generate JWT token
        const token = jwt.sign({ email: User.email, userid: User._id },
            secretKey, { algorithm: 'HS256', expiresIn: '1h' }
        );

        // Set the JWT token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Redirect to the homepage or another page
        res.redirect("/Notely/home"); // Uncomment or adjust as needed

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('An error occurred during the password reset process.'); // Send a more informative message
    }
});




module.exports = router;