"use strict";

/** Routes for podcasts. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const { getPodcasts, setPodcastJSONArchive } = require("../helpers/direct_queries");
const { getJSPodcasts} = require("../helpers/json_queries");
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
        
        const episodes = await getJSPodcasts()      

        console.log(episodes.length)
        const podcastList = []
            
        for (let i = 0; i < 5; i++) {   
            // console.log(responses.data[i].id)
            let episode = {
                "id": episodes[i].id, 
                "title": episodes[i].title, 
            }
            podcastList.push(episode)
        }

        return res.status(200).json(podcastList);
    } catch (err) {
        return next(err);
    }

    // try {
    //     const episodes = await getPodcasts()
    //     const podcastList = []
        
    //     for (let i = 0; i < episodes.data.length; i++) {   
    //         // console.log(responses.data[i].id)
    //         let episode = {
    //             "id": episodes.data[i].id, 
    //             "title": episodes.data[i].title, 
    //         }
    //        podcastList.push(episode)
    //     }

    //     return res.status(200).json(podcastList);
    // } catch (err) {
    //     return next(err);
    // }
});

module.exports = router