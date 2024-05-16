const notesModel = require("../models/notes")

const editnoteController = async(req, res) => {
    try {
        const { title, description } = req.body;
        const existingNote = await notesModel.findById(req.params.noteId);
        if (!existingNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        const updatedTitle = title ? title : existingNote.title;
        const updatedDescription = description ? `${existingNote.description} \n\n ${description}` : existingNote.description

        const updatedNote = {
            title: updatedTitle,
            description: updatedDescription,
            previousVersions: existingNote.previousVersions ? [...existingNote.previousVersions, {
                title: existingNote.title,
                description: existingNote.description,
                updatedAt: existingNote.updatedAt,
            }] : [],
            updatedAt: Date.now(),
        };

        await notesModel.findByIdAndUpdate(req.params.noteId, updatedNote);
        res.redirect("/Notely/profile");

    } catch (error) {
        console.error(error);
        res.status(500).render("server")
    }
}



module.exports = editnoteController;