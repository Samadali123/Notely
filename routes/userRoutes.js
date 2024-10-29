const express = require(`express`)
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userModel = require("../models/users");
const GoogleStrategy = require('passport-google-oidc');
const passport = require('passport');
const { config } = require('dotenv');
const { v4: uuidV4 } = require(`uuid`);
const upload = require("../utils/multer");
const IsLoggedIn = require("../middlewares/auth.middleware")
const IndexController = require("../controllers/index.controller")
const LoginController = require("../controllers/loginpage.controller")
const RegisterAccountController = require("../controllers/regiter.controller")
const LoginAccountController = require("../controllers/login.controller")
const LogoutController = require("../controllers/logout.controller");
const ProfileController = require('../controllers/profile.controller');
const HomeController = require("../controllers/home.controller");
const EditProfileController = require('../controllers/editprofile.controller');
const CreateNotesController = require('../controllers/createnotespage.controller');
const AddNotesController = require('../controllers/newnotes.controller');
const OpenNoteController = require('../controllers/opennotes.controller');
const DeleteNoteController = require('../controllers/deletenote.controller');
const EditPageController = require('../controllers/editnotepage.controller');
const EditNoteController = require('../controllers/editnote.controller');
const SearchNotesController = require("../controllers/searchnotes.controller")
const ForgotPasswordPageController = require("../controllers/forgot.controller")
const ForgotPasswordController = require("../controllers/forgotpassword.controller")
const ResetPageController = require("../controllers/resetpage.controller")
const ResetPasswordController = require("../controllers/resetpassword.controller")
const EmailSentPageController = require("../controllers/MailPage.controller")



//call the environment varibles set in  env

const secretKey = process.env.JWT_SECRET_KEY;
// index Api
router.get("/Notely", IndexController);

//  login page Api
router.get("/Notely/login", LoginController)


// Regiter account Api
router.post("/Notely/registeraccount", RegisterAccountController);


// Login Api
router.post("/Notely/login", LoginAccountController)

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
        return cb(null, newUser)
    }
}));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/Notely/home',
    failureRedirect: '/Notely/login'
}))


//Logout Api
router.get("/Notely/logout", IsLoggedIn, LogoutController)

// Home APi
router.get("/Notely/home", IsLoggedIn, HomeController)

// Profile Api
router.get("/Notely/profile", IsLoggedIn, ProfileController);


// Edit profile Api
router.post(`/Notely/edit/profile`, IsLoggedIn, upload.single('image'), EditProfileController)

//Create Notes page Api
router.get("/Notely/create/notes", IsLoggedIn, CreateNotesController)


// Make new Notes Api
router.post("/Notely/add/notes", IsLoggedIn, AddNotesController)


//Open note Api
router.get('/Notely/opennote/:noteId', IsLoggedIn, OpenNoteController)


// Delete note Api
router.get("/Notely/deletenote/:noteId", IsLoggedIn, DeleteNoteController)



// Edit Note Api
router.get("/Notely/editnote/:noteId", IsLoggedIn, EditPageController)


//Update Note Api
router.post("/Notely/updatenote/:noteId", IsLoggedIn, EditNoteController);


//Search Note Api
router.get(`/Notely/search/notes`, IsLoggedIn, SearchNotesController);


//forgot password page Api
router.get("/Notely/forgotpassword", ForgotPasswordPageController)


// Forgot Password Api
router.post("/Notely/forgotpassword", ForgotPasswordController)


// Email Sent Success Api
router.get("/Notely/Email/sent/successfully", EmailSentPageController)


// Reset Page Api
router.get('/Notely/resetpassword', ResetPageController)


// Reset passworr Api
router.post('/Notely/resetpassword', ResetPasswordController);




module.exports = router;