const userModel = require("../models/users")
const notesModel = require("../models/notes")


const home = async(req, res, next) => {

    try {
        const allnotes = await notesModel.find();

        // Format the date for each note without changing the existing `date` property
        allnotes.forEach((note) => {
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
        res.render('home', { allnotes });
    } catch (err) {
        res.status(500).render("server")
    }

}


module.exports = home;