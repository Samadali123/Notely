const notesModel = require("../models/notes")

const searchNotes = async(req, res) => {
    try {
        const input = req.query.data;
        const regex = new RegExp(`^${input}`, 'i');
        const notes = await notesModel.find({ title: regex });
        if (notes.length > 0) {
            notes.forEach((note) => {
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
                note.formattedDate = formattedDate;
            });

        }
        res.json(notes);

    } catch (err) {
        res.status(500).render("server");
    }
}


module.exports = searchNotes;