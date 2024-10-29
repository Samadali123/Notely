const userModel = require("../models/users")
const notesModel = require("../models/notes")

const addnotes = async (req, res) => {
    const { title, description } = req.body;

    try {
        // Find the logged-in user by email
        const loginuser = await userModel.findOne({ email: req.user.email });

        // Check if user exists
        if (!loginuser) {
            return res.status(404).render("error", { message: "User not found" });
        }

        // Create the note
        const creatednote = await notesModel.create({
            title,
            description,
            user: loginuser._id // Make sure to use the user's ID
        });

        // Push the created note's ID into the user's notes array
        loginuser.notes.push(creatednote._id);
        await loginuser.save();

        // Redirect to the home page after successfully adding the note
        res.redirect("/Notely/home");
    } catch (err) {
        res.status(500).render("server", { message: "An error occurred while adding the note." });
    }
};



module.exports = addnotes;