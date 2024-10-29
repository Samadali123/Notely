const userModel = require("../models/users")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config();



const secretKey = process.env.JWT_SECRET_KEY;
const resetpassword = async(req, res) => {
    try {
        const { email, newPassword } = req.body; // Assuming newPassword is sent in the request
        const User = await userModel.findOne({ email });

        if (!User) {
            return res.json({ error: "User not Found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        const updatedUser = await userModel.findOneAndUpdate({ _id: User._id }, // Target the user by ID
            { password: hashedNewPassword }, { new: true }
        );

        // Generate JWT token
        const token = jwt.sign({ email: User.email, userid: User._id },
            secretKey, { algorithm: 'HS256', expiresIn: '1h' }
        );

        // Set the JWT token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Redirect to the homepage or another page
        res.redirect("/Notely/home"); // Uncomment or adjust as needed

    } catch (error) {
        res.status(500).send('An error occurred during the password reset process.'); // Send a more informative message
    }
}

module.exports = resetpassword;