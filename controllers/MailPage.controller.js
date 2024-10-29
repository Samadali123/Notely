const EmailSuccess = (req, res) => {
 try {
    res.render("sentmail")
 } catch (error) {
     res.status(500).render("server")
 }
}

module.exports = EmailSuccess;