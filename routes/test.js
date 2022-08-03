"use strict";

/** Routes for podcasts. */

const express = require("express");
const { getAllPodcasts, getAllContributors, getAllEditors, getAllTags, getAllResponses } = require("../helpers/archive");
const fs = require("fs");
const path = require("path");
const Contributor = require("../models/contributor");
const Editor = require("../models/editor");
const Podcast = require("../models/podcast");
const Response = require("../models/response");
const Tag = require("../models/tags");
const { 
        dbInsertMediaLinks,
        dbInsertContributors, 
        dbInsertEditors, 
        dbInsertPodcasts, 
        dbInsertResponses, 
        dbInsertTags, 
        dbInsertTypes, 
        dbInsertPodcastContributors, 
        dbInsertPodcastTags,
        dbInsertPodcastResponses,
        dbInsertResponseContributors } = require("../helpers/db_conversion");


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
                "podcast_id": responses[i].acf.in_response_to[0],
                "title": responses[i].title.rendered,
                "slug": responses[i].slug,
                "content": responses[i].content.rendered,
                "excerpt": responses[i].excerpt.rendered,
                "featured_image": responses[i].featured_media,
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

router.get("/jsonFetch/:title", async function (req, res, next) {
    const title = req.params.title
    try {

       const episode = await Podcasts.searchJSON(title);

        return res.status(200).json( episode );
    } catch (err) {
        return next(err);
    }   
});

router.get("/dbINSERT/types", async function (req, res, next) {
    try {
        // const contributors = await getJSContributors();
        const data = require("../json/types.json");

        for (let type of data){
            
            await dbInsertTypes(type)
        }

        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/dbINSERT/contributors", async function (req, res, next) {
    try {
        // const contributors = await getJSContributors();
        const data = require("../json/contributors.json");

        for (let contributor of data){
            
           await dbInsertContributors(contributor)
        }

        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/dbINSERT/editors", async function (req, res, next) {
    try {
        // const editors = await getJSEditors();
        const data = require("../json/editors.json");

        for (let editor of data){
            console.log(editor)
            
            await dbInsertEditors(editor)
        }
        
        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/dbINSERT/podcasts", async function (req, res, next) {
    try {
        // const podcasts = await getJSPodcasts();
        const data = require("../json/podcasts.json");

        // const count = Object.keys(data).length;
        // console.log(count);

        for (let podcast of data){
            // console.log(podcast)
            await dbInsertPodcasts(podcast);
            await dbInsertPodcastContributors(podcast);
            await dbInsertPodcastTags(podcast);
            
        }

        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/dbINSERT/responses", async function (req, res, next) {
    try {
        // const responses = await getJSResponses();
        const data = require("../json/responses.json");

        for (let response of data){
            
            await dbInsertResponses(response);
            
        }

        for (let response of data){
            await dbInsertResponseContributors(response);
            
        }

        const data_podcasts = require("../json/podcasts.json");

        for (let podcast of data_podcasts){
            await dbInsertPodcastResponses(podcast);
        }

        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/dbINSERT/tags", async function (req, res, next) {
    try {
        // const tags = await getJSTags();
        const data = require("../json/tags.json");

        for (let tag of data){
            // console.log(tag)
            await dbInsertTags(tag)
        }

        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/textResponseLength/", async function (req, res, next) {
    try {
        const data = require("../json/responses.json");

        for (let response of data){
            
            // let text = JSON.stringify(response.content)
            // console.log(text)
            let textLength = (response.content).length
            
            console.log(textLength)
            if (textLength > 65535) {
                console.log(`${response.title} is too long`)
            }
        }

        return res.status(200).json( "response lengths checked" );

    }
    catch (err) {
        return next(err);
    }
});

router.get("/textPodcastLength/", async function (req, res, next) {
    try {
        const data = require("../json/podcasts.json");

        for (let podcast of data){
            
            // let text = JSON.stringify(response.content)
            // console.log(text)
            let textLength = (podcast.content).length
            
            console.log(textLength)
            if (textLength > 65535) {
                console.log(`${podcast.title} is too long`)
            }
        }

        return res.status(200).json( "Podcast Lengths checked" );

    }
    catch (err) {
        return next(err);
    }
});

router.get("/responsesMissingPodcasts", async function (req, res, next) {
    try { 
        const data = require("../json/responses.json");

        let output = []

        for (let response of data) {

            if (response.podcast_id == null) {
                output.push({
                    "response_id": response.response_id,
                    "title": response.title,
                    "date_created" : response.date_created,
                    "slug" : response.slug
                })
            }

        }

        return res.status(200).json( output );
    } catch (err) {
        return next(err);
    }
});

router.get("/podcastsMultipleResponses", async function (req, res, next) {
    try {
        const data = require("../json/podcasts.json");

        let output = []

        for (let podcast of data) {

            if (podcast.response.length > 2) {
                output.push({
                    "podcast_id": podcast.podcast_id,
                    "title": podcast.title,
                    "date_created" : podcast.date_created,
                    "slug" : podcast.slug
                })
            }

        }

        return res.status(200).json( output );

    } catch (err) {
        return next(err);
    }
});

router.get("/persons/featuredMedia/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const person = await Contributor.getContributorById(id);
        const url = await Contributor.fetchMedia(id);

        return res.status(200).json( { person, url } );
    } catch (err) {
        return next(err);
    }
});

router.get("/podcast/featuredMedia/", async function (req, res, next) {
    try {

        const data = require("../json/podcasts.json");

        for (let podcast of data) {

            if (podcast.featured_image === 27105) {
                continue;
            }

            let id = podcast.id;
            const url = await Podcast.fetchMedia(id);

            await dbInsertMediaLinks({"id": id, "featured_image_url": url});
        }
        return res.status(200).json( "import complete" );
    } catch (err) {
        return next(err);
    }
});

router.get("/response/featuredMedia/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const response = await Response.getResponseById(id);
        const url = await Response.fetchMedia(id);

        return res.status(200).json( { response, url } );
    } catch (err) {
        return next(err);
    }
});

router.get("/unsplash/", async function (req, res, next) {
    try {
        console.log("Retrieving unsplash images");
        const data = await axios.get("https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=religion&orientation=landscape&count=1");

        return res.status(200).json( data.data );
    } catch (err) {
        return next(err);
    }
});

module.exports = router;