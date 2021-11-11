const mongoose = require('mongoose');

//creating schema
const profileSchema = new mongoose.Schema({

    //schema for profile page
    // coverPic: { type: String, required: false },
    headline: { type: String, required: false },
    about: { type: String, required: false },
    featured: { type: Array, required: false },
    activities: { type: Array, required: false },
    experience: { type: Array, required: false },
    education: { type: Array, required: false },
    endorsement: { type: Array, required: false },
    interests: { type: Array, required: false },

}, {
    versionKey: false,
    timestamps: true
});


module.exports = mongoose.model("profile", profileSchema);

