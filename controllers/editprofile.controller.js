const userModel = require("../models/users")

const editprofileController = async(req, res, next) => {
    try {
        const loginuser = await userModel.findOne({ email: req.user.email });
        loginuser.profile = req.file.filename;
        await loginuser.save();
        res.redirect(`/Notely/profile`);
    } catch (err) {
        res.status(500).render("server")
    }

}

module.exports = editprofileController;