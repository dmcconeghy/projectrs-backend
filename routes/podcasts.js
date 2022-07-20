"use strict";

/** Routes for podcasts. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const { getPodcasts } = require("../helpers/queries");
const Podcast = require("../models/podcast");

const router = express.Router({ mergeParams: true });

/** GET / 
 * { podcasts: [ { id, title, description, imageUrl, episodes: [ { id, title, description, audioUrl }, ... ] }, ... ] }
 *  
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)
 * - description (will find case-insensitive, partial matches)
 * - date (will find matches within a given date range)
 * - guests (will find matches with a given guest)
 * - tags (will find matches with a given tag)
 * - trancsription (will find matches with a given transcription)
 *  
 * 
 * 
*/

router.get("/", async function (req, res, next) {

    try {
   
        const episodes = await getPodcasts()
        const podcasts = []
        

        for (let i = 0; i<episodes.data.length; i++) {
            let episode = {"id": episodes.data[i].id, "title": episodes.data[i].title.rendered, "url": episodes.data[i].link}
            podcasts.push(episode)
        }
        
        return res.status(200).json( podcasts );
    } catch (err) {
        return next(err);
    }


    try {
        // const podcasts = await Podcast.findAll();
        // return res.status(200).json({ podcasts });
        // return res.json(test);
    
        // console.log(podcasts.data)
        // const title = podcasts.data.title.rendered;
        // const author = podcasts.data.author; 
        // const contributors = podcasts.data.acf.persons; 
        // const mp3 = podcasts.data.acf.wp_media_location;
        // const mini = { title, author, contributors, mp3 }
        return res.status(200).json( podcasts.data );
    } catch (err) {
        return next(err);
    }
});

module.exports = router