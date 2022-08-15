/** Temporary Homepage */

const express = require("express");

const router = express.Router({ mergeParams: true });


router.get("/", async function (req, res, next) {
    try {
        // const podcasts = await Podcast.findAll();
        // return res.status(200).json({ podcasts });
        // return res.json(test);
        
        return res.json("Hello World!");
    } catch (err) {
        return next(err);
    }
});

module.exports = router