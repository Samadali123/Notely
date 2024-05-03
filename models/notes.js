const mongoose = require("mongoose")

const notesSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },

    description: {
        type: String,
        required: [true, "description is required"],
        unique: true,

    },

    date: {
        type: Date,
        default: Date.now(),
    }

}, { versionkey: false });

module.exports = mongoose.model("note", notesSchema);