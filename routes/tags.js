"use strict";

/** Routes for podcasts. */

const express = require("express");

const Tag = require("../models/tag");
const Podcast = require("../models/podcast");

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {

    const q = req.query;

    try {
        
        const tags = await Tag.findAll(q);    

        return res.status(200).json(tags);
    } catch (err) {
        return next(err);
    }
    
    // try {
   
    //     const tags = await getTags()
    //     console.log("waiting for tags")
    //     const tagList = []

    //     for (let i = 0; i < tags.data.length; i++) {   
    //         // console.log(tags.data[i].id)
    //         let tag = {"id": tags.data[i].id, "name": tags.data[i].name, "count": tags.data[i].count, "url": tags.data[i].link}
    //         tagList.push(tag)
    //     }
        
    //     return res.status(200).json( tagList );
    // } catch (err) {
    //     return next(err);
    // }
});

router.get("/:id_or_slug/", async function (req, res, next) {
    console.log("Fetching tag by id or slug")
    try {
        
        if (!isNaN(req.params.id_or_slug)) {
            // console.log(parseInt(req.params.id_or_slug));
            console.log("Input is id number :", req.params.id_or_slug)

            const tag = await Tag.getTagById(req.params.id_or_slug);
            return res.status(200).json(tag);

        } else {
            console.log("Input is slug :", req.params.id_or_slug)

            const tag = await Tag.getTagBySlug(req.params.id_or_slug);
            return res.status(200).json(tag);
        }

    } catch (err) {
        return next(err);
    }
});

router.get("/search/:query", async function (req, res, next) {
    console.log("Fetching tag by query :", req.params.query)
    try {
        
        const tags = await Tag.searchTags(req.params.query);
        if (tags.length === 0) {
            return res.status(404).json({ message: "No tags found" });
        } else {
            return res.status(200).json(tags);
        }
    } catch (err) {
        return next(err);
    }
});

router.get("/:id/podcasts", async function (req, res, next) {
    console.log("Fetching Podcasts by id")
    try {
        console.debug(`id: ${req.params.id}`)

        const podcastsList = await Tag.getPodcastsByTagId(req.params.id);
        console.log(podcastsList)

        let podcasts= []

        for (let podcast of podcastsList) {
            console.log(podcast.podcast_id)
            const item = async () => await Podcast.getPodcastById(podcast.podcast_id);
            
            podcasts.push(await item())
        }
    
        if (podcasts.length === 0) {
            return res.status(404).json({ message: "No podcasts found" });
        } else{
            return res.status(200).json( podcasts );
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router