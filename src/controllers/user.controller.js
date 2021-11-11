const fs = require('fs');
const express = require("express");

const User = require("../models/user.model");
const protect = require('../middlewares/protect');

const { body, validationResult } = require('express-validator');
const router = express.Router();

//Post Routing
router.post("/newuser",

    body("email").isEmail().withMessage("please enter valid email"),
    body("password").isLength({ min: 8 }).withMessage("please enter 8 digit password"),
    body("phone").isLength({ min: 10, max: 10 }).withMessage("please enter 10 digit mobile number"),
    body("first_name").isLength({ min: 2 }).withMessage("please enter valid first name"),
    body("last_name").isLength({ min: 2 }).withMessage("please enter valid last name"),

    async (req, res) => {

        try {
            const user = await User.create(req.body);

            return res.status(201).json({ user: user })

        } catch (err) {
            return res.status(400).json({ status: "failed", message: err.message });
        }
    });

//Get Routing
router.get("/getAllUsers", async (req, res) => {

    try {
        //Adding pagination
        const page = +req.query.page || 1;
        const size = +req.query.size || 4;

        const offset = (page - 1) * size;

        const users = await User.find().skip(offset).limit(size).lean().exec();

        //Getting total no. of documents
        const totalPages = Math.ceil((await User.find().countDocuments()) / size);

        return res.status(200).json({ users: users, totalPages });

    } catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }
});

//Put Routing
router.patch('/', protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select('-password');

        return res.status(200).json({ user: user });
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});


//Delete Routing





module.exports = router;

