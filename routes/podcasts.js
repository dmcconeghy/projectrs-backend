"use strict";

/** Routes for podcasts. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const Podcast = require("../models/podcast");


const router = express.Router({ mergeParams: true });

/** GET / 
 * { podcasts: [ { podcast_id, date_created, podcast_post_url, slug, title, content, excerpt, featured_image, editor, mp3_file_url, type } ] }
 *  
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)
 * - content (will find case-insensitive, partial matches)
 * - contributor (will find case-insensitive, partial matches)
 * 
 * 
*/

router.get("/", async function (req, res, next) {
    
    const q = req.query;

    try {
        // schema validators can go here

        const podcasts = await Podcast.findAll(q);
        // console.log(podcasts)
        
        return res.status(200).json( podcasts );
    } catch (err) {
        next(err);
    }
});

router.get("/:slug", async function (req, res, next) {
    try {
        const podcast = await Podcast.getPodcastBySlug(req.params.slug);
        return res.status(200).json( podcast );
    } catch (err) {
        return next(err);
    }
});

module.exports = router