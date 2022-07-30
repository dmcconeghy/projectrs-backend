"use strict";

/** Routes for responses. */

const express = require("express");
const { getResponses } = require("../helpers/direct_queries");
const { getJSResponses} = require("../helpers/json_queries");
const Response = require("../models/response");

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
        return res.status(200).json({ responses });
    } catch (err) {
        next(err);
    }
});

router.get("/:slug", async function (req, res, next) {
    try {
        const response = await Response.getResponseBySlug(req.params.slug);
        return res.status(200).json( response );
    } catch (err) {
        return next(err);
    }
});


module.exports = router