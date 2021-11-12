const fs = require('fs');
const express = require("express");

const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const { body, validationResult } = require('express-validator');
const router = express.Router();

//Post Routing


//Put Routing
router.patch("/",

    async (req, res) => {

        try {
            const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            }).select('-password');

            return res.status(201).json({ profile: profile })

        } catch (err) {
            return res.status(400).json({ status: "failed", message: err.message });
        }
    });

//Get Routing
router.get("/", async (req, res) => {

    try {
        const profile = await Profile.findById(req.params.id).exec();

        return res.status(200).json({ profile: profile });

    } catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }
});



//Delete Routing

router.delete('/:id', async (req, res) => {
    try {
        const profile = await Profile.findByIdAndRemove(req.params.id).select(
            '-password'
        );
        return res.status(201).json({ profile: profile });
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});



module.exports = router;

