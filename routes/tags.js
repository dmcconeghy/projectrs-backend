"use strict";

/** Routes for podcasts. */

const express = require("express");
const { getTags } = require("../helpers/direct_queries");
const { getJSTags} = require("../helpers/json_queries");

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {
    try {
        
        const tags = await getJSTags()    

        console.log(tags.length)
        console.log(tags[0])
        const tagsList = []
            
        for (let i = 0; i < 5; i++) {   
            // console.log(tags.data[i].id)
            let tag = {
                "id": tags[i].id, 
                "name": tags[i].name, 
            }
            tagsList.push(tag)
        }

        return res.status(200).json(tagsList);
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

module.exports = router