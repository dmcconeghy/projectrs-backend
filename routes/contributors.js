"use strict";

/** Routes for contributors. */

const express = require("express");
const { getContributors } = require("../helpers/direct_queries");
const { getJSContributors} = require("../helpers/json_queries");
const Contributor = require("../models/contributor");

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

        return res.status(200).json({ contributors });
    } catch (err) {
        return next(err);
    }

});

router.get("/:slug", async function (req, res, next) {
    try {
        const contributor = await Contributor.getContributorBySlug(req.params.slug);
        return res.status(200).json(contributor);
    } catch (err) {
        return next(err);
    }
});

module.exports = router