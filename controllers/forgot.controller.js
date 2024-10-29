const forgotpage = (req, res, next) => {
   try {
    res.render("forgotpassword", )
   } catch (error) {
     res.status(500).render("server")
     
   }

}

module.exports = forgotpage;