const fs = require('fs');
const express = require("express");

const User = require("../models/user.model");
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

//Put Routing

//Delete Routing





module.exports = router;

