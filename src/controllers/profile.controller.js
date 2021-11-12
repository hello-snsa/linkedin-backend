const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).lean().exec();
		return res.status(200).json({ profile: profile });
	} catch (e) {
		return res.status(400).json
	}
})
