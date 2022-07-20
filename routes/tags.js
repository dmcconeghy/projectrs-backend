"use strict";

/** Routes for podcasts. */

const express = require("express");
const { getTags } = require("../helpers/queries");

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {
    try {
   
        const tags = await getTags()
        const tag = {}

        for (let i = 0; i<tags.data.length; i++) {   
            // console.log(tags.data[i].id)
            tag[tags.data[i].name] = [ {"id": tags.data[i].id, "count": tags.data[i].count, "url": tags.data[i].link} ]
        }
        
        return res.status(200).json( tag );
    } catch (err) {
        return next(err);
    }
});

module.exports = router