const userModel = require("../models/users")
const notesModel = require("../models/notes")

const addNotesController = async(req, res) => {
    const { title, description } = req.body;

    const loginuser = await userModel.findOne({ email: req.user.email });
    try {
        const creatednote = await notesModel.create({
            title,
            description,
            user: loginuser
        });

        loginuser.notes.push(creatednote._id);
        await loginuser.save();

        res.redirect("/Notely/home")

    } catch (err) {
        res.status(500).render("server")
    }
}


module.exports = addNotesController;