"use strict";

/** Routes for responses. */

const express = require("express");
const { getResponses } = require("../helpers/direct_queries");
const { getJSResponses} = require("../helpers/json_queries");
const Response = require("../models/response");

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {

    try {
        
        const responses = await getJSResponses()    

        console.log(responses.length)
        const responseList = []
            
        for (let i = 0; i < 5; i++) {   
            // console.log(responses.data[i].id)
            let response = {
                "id": responses[i].id, 
                "title": responses[i].title, 
            }
            responseList.push(response)
        }

        return res.status(200).json(responseList);
    } catch (err) {
        return next(err);
    }

    // try {
   
    //     const responses = await getResponses()
    //     console.log("waiting for responses")
    //     const responseList = []

    //     for (let i = 0; i < responses.data.length; i++) {   
    //         // console.log(responses.data[i].id)
    //         let response = {
    //             "id": responses.data[i].id, 
    //             "title": responses.data[i].title.rendered, 
    //             "content": responses.data[i].content.rendered, 
    //             "url": responses.data[i].link,
    //             "featured_media": responses.data[i].featured_media,
    //             "contributor": responses.data[i].acf.persons,
    //             "reponds_to": responses.data[i].acf.in_response_to
    //         }
    //         responseList.push(response)
    //     }
        
    //     return res.status(200).json( responseList );
    // } catch (err) {
    //     return next(err);
    // }
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