const notesModel = require("../models/notes")

const opennoteController = async(req, res) => {
    try {
        const opennote = await notesModel.findOne({ _id: req.params.noteId });

        let formattedDate;

        let date = opennote.date;
        let dateObj = new Date(date);

        let monthNames = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();

        let monthName = monthNames[month];
        formattedDate = `${monthName} ${day}, ${year}`;

        res.render("opennote", { opennote, formattedDate });

    } catch (error) {
        res.status(500).render("server")

    }
}


module.exports = opennoteController;