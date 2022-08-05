"use strict";

/** Routes for contributors. */

const express = require("express");
const { getContributors } = require("../helpers/direct_queries");
const { getJSContributors} = require("../helpers/json_queries");
const Contributor = require("../models/contributor");
const Podcast = require("../models/podcast");
const Response = require("../models/response");

const router = express.Router({ mergeParams: true });

/**
 * 
 * GET /
 * { contributors: [ { contributor_id, name, slug, bio_text, profile_image, type } ] }
 * 
 * Can provide search filter in query:
 * - name (will find case-insensitive, partial matches)
 * 
 */ 

router.get("/", async function (req, res, next) {

    const q = req.query;

    try {
        
        // schema validators can go here

        const contributors = await Contributor.findAll(q);

        return res.status(200).json( contributors );
    } catch (err) {
        return next(err);
    }

});

router.get("/:id_or_slug", async function (req, res, next) {
    console.log("Fetching contributor by id or slug")

    try {

        if (!isNaN(req.params.id_or_slug)) {
            // console.log(parseInt(req.params.id_or_slug));
            console.log("Input is id number :", req.params.id_or_slug)

            const contributor = await Contributor.getContributorBySlug(req.params.id_or_slug);
            return res.status(200).json( contributor );
        } else {
            console.log("Input is slug :", req.params.id_or_slug)

            const contributor = await Contributor.getContributorById(req.params.id_or_slug);
            return res.status(200).json( contributor );
        }

    } catch (err) {
        return next(err);
    }
});

router.get("/:id/podcasts", async function (req, res, next) {
    console.log("Fetching podcasts by contributor id")

    try {

        const podcastsList = await Contributor.getPodcastsByContributorId(req.params.id);

        let podcasts = [];
        
        for (let podcast of podcastsList) {

            const item = async () => await Podcast.getPodcastById(podcast.podcast_id); 
            podcasts.push(item());
            }

        if (podcasts.length === 0) {
            return res.status(200).json( {message: "No podcasts found for contributor"} );
        } else {
            return res.status(200).json( podcasts );
        }

    } catch (err) {
        return next(err);
    }
});

router.get("/:id/responses", async function (req, res, next) {
    console.log("Fetching responses by contributor id")

    try {

        const responsesList = await Contributor.getResponsesByContributorId(req.params.id);

        let responses = [];

        for (let response of responsesList) {

            const item = async () => await Response.getResponseById(response.response_id);
            responses.push(item());
        }

        if (responses.length === 0) {
            return res.status(200).json( {message: "No responses found for contributor"} );
        } else {
            return res.status(200).json( responses );
        }

    } catch (err) {
        return next(err);
    }
});
        

module.exports = router