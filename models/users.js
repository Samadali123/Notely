const mongoose = require("mongoose")



const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,

    },

    password: {
        type: String,
        required: [true, "password is required"],

    }
});




module.exports = mongoose.model("user", userSchema);