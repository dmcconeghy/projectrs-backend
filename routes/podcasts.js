/** Routes for podcasts. */

const express = require("express");

const Podcast = require("../models/podcast");
const Tag = require("../models/tag");
const Contributor = require("../models/contributor");


const router = express.Router({ mergeParams: true });

/** GET / 
 * { podcasts: [ { podcast_id, date_created, podcast_post_url, slug, title, content, excerpt, featured_image, editor, mp3_file_url, type } ] }
 *  
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)
 * - content (will find case-insensitive, partial matches)
 * - contributor (will find case-insensitive, partial matches)
 * - 
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

router.get("/:id_or_slug", async function (req, res, next) {
    console.log("Fetching podcast by id or slug")

    try {
        
        if (!isNaN(req.params.id_or_slug)) {
            // console.log(parseInt(req.params.id_or_slug));
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

/**
 * GET /:id/tags
 * 
 * Accepts a podcast_id and returns a list of tags associated with that podcast.
 * 
 * GET /25786/tags returns a list of tags associated with podcast 25786.  
 * 
 * ie. [{"tag_id": 2684,"name": "Africana","slug": "africana","count": 1}, {...}]
 */

router.get("/:id/tags", async function (req, res, next) {
    console.log("Fetching tags for podcast")
    try {
    

        const tagsList = await Podcast.getTagsByPodcastId(req.params.id);

        let tags = []

        for (let tag of tagsList){
            
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

router.get("/:id/contributors", async function (req, res, next) {
    console.log("Fetching contributors for podcast")
    try {

        const contributorsList = await Podcast.getContributorsByPodcastId(req.params.id);

        let contributors = []

        for (let contributor of contributorsList){

            const item = async () => await Contributor.getContributorById(contributor.contributor_id);
            contributors.push(await item())
        }

        if (contributors.length === 0) {
            return res.status(404).json({ message: "No contributors found" });
        } else{
            return res.status(200).json( contributors );
        }
    } catch (err) {
        return next(err);
    }
});

router.get("/:id/responses", async function (req, res, next) {
    console.log("Fetching responses for podcast")
    try {

        const responsesList = await Podcast.getResponsesByPodcastId(req.params.id);

        let responses = []

        for (let response of responsesList){

            const item = async () => await Response.getResponseById(response.response_id);
            responses.push(await item())
        }

        if (responses.length === 0) {
            return res.status(404).json({ message: "No responses found" });
        } else{
            return res.status(200).json( responses );
        }
    } catch (err) {
        return next(err);
    }
});


module.exports = router