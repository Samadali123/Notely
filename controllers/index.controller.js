const indexController = async(req, res) => {
    try {
        res.render('index');
    } catch (err) {
        res.status(500).render("server")
    }
}


module.exports = indexController;