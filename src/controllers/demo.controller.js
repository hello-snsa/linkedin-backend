//this is for demo purpose

const fs = require('fs');
const express = require("express");

const { body, validationResult } = require('express-validator');

const Demo = require("../models/demo.model");
const User = require("../models/demo.model");
const upload = require("../middlewares/file-upload");
const sendEmail = require('../utils/sendmail');

const protect = require("../middlewares/protect");

const router = express.Router();

//POST routing

//note: 1st is for route and last is for callback function, and everything in between is middleware
router.post("/",

    body("email").isEmail().withMessage("please enter valid email"),
    body("password").isLength({ min: 8 }).withMessage("please enter 8 digit password"),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ data: errors.array() });
            }

            const user = await User.create(req.body);
            return res.status(201).json({ user: user })

        } catch (err) {
            return res.status(400).json({ status: "failed", message: err.message });
        }
    });
router.post("/newuser", async (req, res) => {

    try {
        const user = await User.create(req.body);

        await sendEmail({
            to: user.email, // list of receivers
            subject: "Demo mail", // Subject line
            text: "Hello bro...", // plain text body
            html: "<h1>Hello there. This is a test mail.</h1>",
        });


        return res.status(201).json({ user: user });

    } catch (err) {
        return res.status(400).json({ status: "failed", message: err });
    }
});


router.post("/single", upload.single("demoImages"), async (req, res) => {
    try {
        // console.log(req.file);
        const demo = await Demo.create({
            title: req.body.title,
            price: req.body.price,
            image_urls: req.file.path
        })
        return res.status(201).send(demo);

    } catch (err) {
        return res.status(400).json({ status: "failed", message: err });
    }
});


router.post("/multiple", upload.array("demoImages"),
    async (req, res) => {
        try {
            const files = req.files.map((file) => file.path);
            const demo = await demo.create({
                title: req.body.title,
                price: req.body.price,
                image_urls: files,
            });
            // res.status(201).json({ data: demo });
            return res.status(201).send(demo);
        }
        catch (err) {
            files.map((path) => fs.unlinkSync(path));
            return res.status(400).json({ status: "failed", message: err });
        }
    });



//Getting data
router.get("/getAllUsers", async (req, res) => {

    try {
        //Adding pagination
        const page = +req.query.page || 1;
        const size = +req.query.size || 2;

        const offset = (page - 1) * size;

        // const users = await User.find().lean().exec();
        const users = await User.find().skip(offset).limit(size).lean().exec();

        //Getting total no. of documents
        const totalPages = Math.ceil((await User.find().countDocuments()) / size);

        // return res.status(200).json({ users: users });
        return res.status(200).json({ users: users, totalPages });

    } catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }
});



router.get("/signin", protect, async (req, res) => {
    console.log("req user", await req.user);
    try {

        const users = await User.find({}).select('-password').lean().exec();

        return res.status(200).json({ data: users });


    } catch (err) {
        return res.status(400).json({ status: "failed", message: err });
    }
});

router.get("/getUsers", async (req, res) => {

    try {
        //Adding pagination
        const page = +req.query.page || 1;
        const size = +req.query.size || 2;

        const offset = (page - 1) * size;

        // const users = await User.find().lean().exec();
        const users = await User.find().skip(offset).limit(size).lean().exec();

        //Getting total no. of documents
        const totalPages = Math.ceil((await User.find().countDocuments()) / size);

        // return res.status(200).json({ users: users });
        return res.status(200).json({ users: users, totalPages });

    } catch (err) {
        return res.status(400).json({ status: "failed", message: err.message });
    }
})


module.exports = router;