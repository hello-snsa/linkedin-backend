const mongoose = require('mongoose');

//creating schema
const userSchema = new mongoose.Schema({

    //schema for signup page
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: false, minlength: 10, maxlength: 10 },
    first_name: { type: String, required: true, minlength: 2 },
    last_name: { type: String, required: true, minlength: 2 },

    //schema for user details
    country: { type: String, required: false },
    city: { type: String, required: false },
    recentJob: { type: String, required: false },
    employmentType: { type: String, required: false },
    recentCompany: { type: String, required: false },

    //schema for user photos
    dp: { type: String, required: false },
    backgroundImage: { type: String, required: false },

}, {
    versionKey: false,
    timestamps: true
});


module.exports = mongoose.model("user", userSchema);

