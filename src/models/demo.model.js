//This is for demo purpose

// 1: create schema
// 2. creating the model

const mongoose = require("mongoose");

// creating schema
const demoSchema = new mongoose.Schema({

    title: { type: String, required: true },
    demo: { type: Number, required: true },
    image_urls: [{ type: String, required: true }],

}, {
    versionKey: false,
    timestamps: true
});


// 2. creating the model

module.exports = mongoose.model("demo", demoSchema);