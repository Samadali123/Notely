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



module.exports = router;