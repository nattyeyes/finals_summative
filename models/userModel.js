const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please enter an email."]
        },
        password: {
            type: String,
            required: [true, "Please enter password."]
        },
        isAdmin: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);
module.exports = User;