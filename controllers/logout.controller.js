const logout = (req, res) => {
   try {
    res.clearCookie("token");
    res.redirect("/Notely/login")
   } catch (error) {
     res.status(500).render("server")
   }

}

module.exports = logout;