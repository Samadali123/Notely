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

    },
    profile: {
        type: String,
        default: "https://res.cloudinary.com/dkkrycya8/image/upload/v1730454271/4a0f8187-7eae-4795-bca3-d79c0ac0b8ce_gv5ngq.jpg"
    },

    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'note'
    }]

});




module.exports = mongoose.model("user", userSchema);