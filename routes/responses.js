"use strict";

/** Routes for responses. */

const express = require("express");

const Response = require("../models/response");
const Tag = require("../models/tag");
const Contributor = require("../models/contributor");

/**
 * GET /
 * { responses: [ { response_id, date_created, podcast_id, title, slug, content, excerpt, featured_image, type } ] }
 * 
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)
 * - content (will find case-insensitive, partial matches)
 * - contributor (will find case-insensitive, partial matches)
 * 
 * 
 */

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {

    const q = req.query;

    try {

        // schema validators can go here
        
        const responses = await Response.findAll(q);
        return res.status(200).json( responses );
    } catch (err) {
        next(err);
    }
});

router.get("/:id_or_slug", async function (req, res, next) {
    try {

        if (!isNaN(req.params.id_or_slug)) {

            // console.log(parseInt(req.params.id_or_slug));
            console.log("Input is id number :", req.params.id_or_slug)

            const response = await Response.getResponseById(req.params.slug);
            return res.status(200).json( response );
        } else {
            console.log("Input is slug :", req.params.id_or_slug)

            const response = await Response.getResponseBySlug(req.params.id_or_slug);
            return res.status(200).json( response );
        }
     } catch (err) {
        return next(err);
    }
});

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

module.exports = router