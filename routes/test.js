"use strict";

/** Routes for podcasts. */

const express = require("express");
const { getAllPodcasts } = require("../helpers/queries");
const fs = require("fs");
const path = require("path");

const router = express.Router({ mergeParams: true });

router.get("/", async function (req, res, next) {
    try {
        const episodes = await getAllPodcasts()
        const podcasts = []

        for (let i = 0; i<episodes.length; i++) {
            let episode = {"id": episodes[i].id, "title": episodes[i].title.rendered, "url": episodes[i].link}
            podcasts.push(episode)
        }

        let stringOutput = JSON.stringify(podcasts, null, 2)
        
        fs.writeFile(path.join(__dirname, "../json", "podcasts.json"), stringOutput, function(err) {
            if (err) throw err;
            console.log("Podcasts saved to podcasts.json");
        })

        return res.status(200).json( podcasts );
    } catch (err) {
        return next(err);
    }
});

module.exports = router

    // // const episodesString = JSON.stringify(episodes.data, null, 2)
    //     // console.log(episodesString)
    //     const test = "Does this shit work?"
    //     // fs.writeFileSync('./podcasts.json', episodesString)

         // fs.writeFile('./podcasts.json', JSON.stringify(podcasts), (err) => {
        //     if (err) throw err;
        //     console.log('The file has been updated!');
        // })
