"use strict";

/** Routes for contributors. */

const express = require("express");
const { getContributors } = require("../helpers/direct_queries");
const { getJSContributors} = require("../helpers/json_queries");
const Contributor = require("../models/contributor");

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {
    try {
        
        const contributors = await getJSContributors()
     
        console.log(contributors.length)
        const contributorsList = []
            
        for (let i = 0; i < 5; i++) {   
            // console.log(responses.data[i].id)
            let person = {
                "id": contributors[i].id, 
                "name": contributors[i].name, 
            }
            contributorsList.push(person)
        }

        return res.status(200).json(contributorsList);
    } catch (err) {
        return next(err);
    }

    // try {
   
    //     const contributors = await getContributors()
    //     console.log("waiting for contributors")
    //     const contributorsList = []

    //     for (let i = 0; i < contributors.data.length; i++) {   
    //         // console.log(contributors.data[i].id)

    //         // parsedBio = JSON.parse(contributors.data[i].content.rendered)
    //         // console.log(parsedBio)
    //         let contributor = {
    //             "id": contributors.data[i].id, 
    //             "name": contributors.data[i].title.rendered, 
    //             "bio": contributors.data[i].content.rendered, 
    //             "featured_media": contributors.data[i].featured_media
    //         }
    //         contributorsList.push(contributor)
    //     }
        
    //     return res.status(200).json( contributorsList );
    // } catch (err) {
    //     return next(err);
    // }
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