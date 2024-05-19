const notesModel = require("../models/notes")

const deletenote = async(req, res) => {
    try {
        const deletedNote = await notesModel.findByIdAndDelete(req.params.noteId);
        res.redirect("/Notely/profile");
    } catch (error) {
        res.status(500).render("server")
    }


}


module.exports = deletenote;