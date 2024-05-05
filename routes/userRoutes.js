const express = require(`express`)
const router = express.Router();
const notesModel = require('../models/notes');
const notes = require('../models/notes');



// router.get("/", async(req, res) => {
//     try {
//         const allnotes = await notesModel.find();

//         let formattedDate;
//         allnotes.forEach(function(note) {
//             let date = note.date
//             let dateObj = new Date(date);

//             let monthNames = [
//                 '', 'January', 'February', 'March', 'April', 'May', 'June',
//                 'July', 'August', 'September', 'October', 'November', 'December'
//             ];

//             let day = dateObj.getDate();
//             let month = dateObj.getMonth() + 1;
//             let year = dateObj.getFullYear();

//             let monthName = monthNames[month];
//             formattedDate = `${monthName} ${day}, ${year}`;
//         })
//         res.render('index', { allnotes, formattedDate })
//     } catch (err) {

//         res.status(500).json({ success: false, message: "Something went wrong" });
//     }
// })




router.get("/", async(req, res) => {
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

        // Render the index view and pass the notes with formatted date
        res.render('index', { allnotes });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});




router.get("/mynotes/create/notes", (req, res) => {
    try {
        // Create a Date object representing the current date and time
        const currentDate = new Date();

        // Define an array of month names
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Extract the day, month, and year from the Date object
        const day = currentDate.getDate(); // Gets the day of the month (1-31)
        const month = currentDate.getMonth(); // Gets the month (0-11), array is zero-based
        const year = currentDate.getFullYear(); // Gets the full year (e.g., 2024)

        // Extract the time components (hour and minute)
        let hours = currentDate.getHours(); // Gets the hour (0-23)
        const minutes = currentDate.getMinutes(); // Gets the minutes (0-59)

        // Determine whether the time is "am" or "pm" and convert to 12-hour format
        const period = hours >= 12 ? 'pm' : 'am';
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }

        // Format the minutes to be two digits (e.g., "05" instead of "5")
        const formattedMinutes = String(minutes).padStart(2, '0');

        // Format the date and time as "25 April 11:55 pm"
        const formattedDate = `${day} ${monthNames[month]} ${hours}:${formattedMinutes} ${period}`;

        console.log(formattedDate); // Output example: "25 April 11:55 pm"

        res.render('notes', { formattedDate })

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
})


router.post("/mynotes/add/notes", async(req, res) => {
    const { title, description } = req.body;

    try {
        const creatednote = await notesModel.create({
            title,
            description
        });

        // res.render('notes', { creatednote });
        res.redirect("/")

    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
})












router.get('/mynotes/opennote/:noteId', async(req, res) => {
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
        res.status(500).json({ success: false, message: "Something went wrong" });

    }
})






router.get("/mynotes/deletenote/:noteId", async(req, res) => {
    try {
        const deletedNote = await notesModel.findByIdAndDelete(req.params.noteId);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
})




router.get("/mynotes/editnote/:noteId", async(req, res) => {
    try {

        const editnote = await notesModel.findOne({ _id: req.params.noteId });

        let formattedDate;

        let date = editnote.date;
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

        res.render("editnote", { editnote, formattedDate });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something wen wrong." })
    }

})




router.post("/mynotes/updatenote/:noteId", async(req, res) => {
    try {
        const { title, description } = req.body;
        const updatednote = await notesModel.findByIdAndUpdate({ _id: req.params.noteId }, { $set: { title, description } }, { new: true });
        res.redirect("/");

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong." });
    }


})




module.exports = router;