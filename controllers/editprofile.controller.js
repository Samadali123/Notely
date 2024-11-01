const userModel = require("../models/users")

const editprofile = async(req, res, next) => {
    try {
        const loginuser = await userModel.findOne({ email: req.user.email });
        if(! req.file.path){
            return res.status(400).json({success:false, message : "PLease provide image address"})
        }
        loginuser.profile = req.file.path;
        await loginuser.save();
        res.redirect(`/Notely/profile`);
    } catch (err) {
        res.status(500).render("server")
    }

}

module.exports = editprofile;