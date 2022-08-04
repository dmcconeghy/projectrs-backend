"use strict";

/** Routes for podcasts. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const Podcast = require("../models/podcast");
const Tag = require("../models/tag");


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

// !isNaN(req.params.id_or_slug

router.get("/:id_or_slug", async function (req, res, next) {
    console.log("Fetching podcast by id or slug")

    try {
        
        if (!isNaN(req.params.id_or_slug)) {
            console.log(parseInt(req.params.id_or_slug));
            console.log("Input is id number :", req.params.id_or_slug)

            const podcast = await Podcast.getPodcastById(req.params.id_or_slug);
            return res.status(200).json( podcast );

        } else {
            console.log("Input is slug :", req.params.id_or_slug)

            const podcast = await Podcast.getPodcastBySlug(req.params.id_or_slug);
            return res.status(200).json( podcast );
        }
    
      
    } catch (err) {
        return next(err);
    }
});

router.get("/:id/tags", async function (req, res, next) {
    console.log("Fetching tags by id")
    try {
        console.debug(`id: ${req.params.id}`)

        const tagsList = await Podcast.getTagsByPodcastId(req.params.id);

        let tags = []

        for (let tag of tagsList){
            console.log(tag.tag_id)
            const item = async () => await Tag.getTagById(tag.tag_id);
            tags.push(await item())
        }

        if (tags.length === 0) {
            return res.status(404).json({ message: "No tags found" });
        } else{
            return res.status(200).json( tags );
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router