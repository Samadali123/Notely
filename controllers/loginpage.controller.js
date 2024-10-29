const loginpage = (req, res) => {
try {
    res.render("login")
} catch (error) {
     res.status(500).render("server")
}
}


module.exports = loginpage;