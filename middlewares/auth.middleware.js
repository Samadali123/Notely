function IsLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).render("isloggedin");

    }

    try {
        const data = jwt.verify(token, secretKey);
        req.user = data;
        next();
    } catch (err) {

        console.error('Token verification error:', err);
        return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again" });
    }
}



module.exports = IsLoggedIn;