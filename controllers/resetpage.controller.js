const resetpage = (req, res) => {
 try {
    res.render("resetpassword")
 } catch (error) {
     res.status(error.status || 500).render("server")
 }
}

module.exports = resetpage;