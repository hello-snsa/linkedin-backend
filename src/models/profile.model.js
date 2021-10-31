// 1: create schema
// 2. creating the model

const mongoose = require("mongoose");

// creating schema
const profileSchema = new mongoose.Schema({

    title: { type: String, required: true },
    demo: { type: Number, required: true },
    image_urls: [{ type: String, required: true }],

}, {
    versionKey: false,
    timestamps: true
});


// 2. creating the model
// const schema = mongoose.model("user", userSchema);

// module.exports = schema;

module.exports = mongoose.model("profile", profileSchema);