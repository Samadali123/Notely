const LogoutController = (req, res) => {
    res.clearCookie("token");
    res.redirect("/Notely/login")

}

module.exports = LogoutController;