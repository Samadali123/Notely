const userModel = require("../models/users")



const profilecontroller = async(req, res) => {
    try {
        const loginuser = await userModel.findOne({ email: req.user.email }).populate("notes");
        loginuser.notes.forEach((note) => {
            let date = note.date;
            let dateObj = new Date(date);

            let monthNames = [
                '', 'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            let day = dateObj.getDate();
            let month = dateObj.getMonth() + 1;
            let year = dateObj.getFullYear();

            let monthName = monthNames[month];
            let formattedDate = `${monthName} ${day}, ${year}`;

            // Assign the formatted date to a new property in each note
            note.formattedDate = formattedDate;
        });

        // Move res.render() outside of the forEach loop
        res.render("profile", { loginuser });
    } catch (error) {
        res.status(500).render("server")
    }
}


module.exports = profilecontroller;