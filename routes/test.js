"use strict";

/** Routes for podcasts. */

const express = require("express");
const { getAllPodcasts, getAllContributors, getAllEditors, getAllTags, getAllResponses } = require("../helpers/archive");
const fs = require("fs");
const path = require("path");

const router = express.Router({ mergeParams: true });

router.get("/podcasts", async function (req, res, next) {
    try {
        const episodes = await getAllPodcasts()
        const podcasts = []

        for (let i = 0; i<episodes.length; i++) {
            let episode = {
                "podcast_id": episodes[i].id,
                "date_created": episodes[i].date_gmt,
                "podcast_post_url": episodes[i].link,
                "slug": episodes[i].slug,
                "title": episodes[i].title.rendered, 
                "content": episodes[i].content.rendered,
                "excerpt": episodes[i].excerpt.rendered,
                "author": episodes[i].author,
                "featured_image": episodes[i].featured_media,
                "mp3_file_url": episodes[i].acf.wp_media_location,
                "tags": episodes[i].tags,
                "contributors": episodes[i].acf.persons,
                "response": episodes[i].acf.in_response_to,
                "transcript": episodes[i].acf.transcript,
            }
            podcasts.push(episode)
        }

        let stringOutput = JSON.stringify(podcasts, null, 2)
        
        fs.writeFile(path.join(__dirname, "../json", "podcasts.json"), stringOutput, { flag: 'a'}, function(err) {
            if (err) throw err;
            console.log("Podcasts saved to podcasts.json");
        })

        return res.status(200).json( podcasts );
    } catch (err) {
        return next(err);
    }
});

router.get("/contributors", async function (req, res, next) {
    try {
        const persons = await getAllContributors();
        const contributors = [];

        for (let i = 0; i< persons.length; i++) {
            let person = {
                "contributor_id": persons[i].id, 
                "name": persons[i].title.rendered, 
                "slug": persons[i].slug, 
                "bio": persons[i].content.rendered,
                "profile_image": persons[i].featured_media
            };
            contributors.push(person);
        }
        
        let stringOutput = JSON.stringify(contributors, null, 2);
        
        fs.writeFile(path.join(__dirname, "../json", "contributors.json"), stringOutput, function(err) {
            if (err) throw err;
            console.log("Contributors saved to podcasts.json");
        })

        return res.status(200).json( contributors );
    } catch (err) {
        return next(err);
    }
});

router.get("/editors", async function (req, res, next) {
    try {
        const editors = await getAllEditors();
        const users = [];

        for (let i = 0; i< editors.length; i++) {
            let editor = {
                "editor_id": editors[i].id, 
                "name": editors[i].name, 
                "slug": editors[i].slug, 
                "avatar_image_url": editors[i].avatar_urls
            };
            users.push(editor);
        }

        let stringOutput = JSON.stringify(users, null, 2);

        fs.writeFile(path.join(__dirname, "../json", "editors.json"), stringOutput, function(err) {
            if (err) throw err;
            console.log("Editors saved to editors.json");
        })

        return res.status(200).json( users );
    } catch (err) {
        return next(err);
    }
});

router.get("/tags", async function (req, res, next) {
    try {
        const tags = await getAllTags();
        const tagsArray = [];

        for (let i = 0; i< tags.length; i++) {
            let tag = {
                "tag_id": tags[i].id,
                "name": tags[i].name,
                "slug": tags[i].slug,
                "count": tags[i].count
            };
            tagsArray.push(tag);
        }

        let stringOutput = JSON.stringify(tagsArray, null, 2);

        fs.writeFile(path.join(__dirname, "../json", "tags.json"), stringOutput, function(err) {
            if (err) throw err;
            console.log("Tags saved to tags.json");
        });

        return res.status(200).json( tagsArray );
    } catch (err) {
        return next(err);
    }
});

router.get("/responses", async function (req, res, next) {
    try {
        const responses = await getAllResponses();
        const responsesArray = [];

        for (let i = 0; i< responses.length; i++) {
            let response = {
                "response_id": responses[i].id,
                "date_created": responses[i].date_gmt,
                "podcast_id": responses[i].acf.in_response_to,
                "title": responses[i].title.rendered,
                "slug": responses[i].slug,
                "content": responses[i].content.rendered,
                "excerpt": responses[i].excerpt.rendered,
                "feature_image": responses[i].featured_media,
                "editor": responses[i].author,
                "contributors": responses[i].acf.persons,
                "tags": responses[i].tags,
            };
            responsesArray.push(response);
        }

        let stringOutput = JSON.stringify(responsesArray, null, 2);

        fs.writeFile(path.join(__dirname, "../json", "responses.json"), stringOutput, function(err) {
            if (err) throw err;
            console.log("Responses saved to responses.json");
        });
        
        return res.status(200).json( responsesArray );
    } catch (err) {
        return next(err);
    }
});

module.exports = router;