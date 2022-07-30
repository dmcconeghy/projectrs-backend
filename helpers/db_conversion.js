/**
 * A test for the db_conversion helper to convert a json object to a db table. 
 */

 const db = require("../db");

async function dbInsertContributors(data){
    try {
        if(data){

            const duplicate_check = await db.query(
                `SELECT COUNT(*)
                FROM contributors
                WHERE contributor_id = $1`,
                [data.contributor_id]);
            
            if (duplicate_check.rows[0].count === "0") {

                console.log(`Adding contributor ${data.contributor_id}`);

                const sql = `INSERT INTO contributors (
                            contributor_id, name, slug, bio_text, profile_image) 
                            VALUES ($1, $2, $3, $4, $5)
                            RETURNING *`;

                const values = [
                    data.contributor_id, 
                    data.name, 
                    data.slug, 
                    data.bio, 
                    data.profile_image, 
                    ];

                const result = await db.query(sql, values);

                let Contributor = result.rows[0];

                return Contributor
            }
        }
        
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertEditors(data) {
    try {

        if(data){
            console.log(`Checking editor ${data.editor_id}`);

            const duplicate_check = await db.query(
                `SELECT COUNT(*)
                FROM editors
                WHERE editor_id = $1`,
                [data.editor_id]);

            if (duplicate_check.rows[0].count === "0") {

                console.log(`Adding editor ${data.editor_id}`);

                const result = await db.query(
                    `INSERT INTO editors (
                        editor_id, name, slug, avatar_image_url)
                    VALUES ($1, $2, $3, $4)
                    RETURNING editor_id, name, slug, avatar_image_url`,
                    [
                        data.editor_id,
                        data.name,
                        data.slug,
                        data.avatar_image_url,
                    ]);
                let editor = result.rows[0];

                return editor;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertPodcasts(data) {
    try {

        if(data){
            // console.log(`Checking podcast ${data.id}`);

            const duplicate_check = `SELECT COUNT(*)
                                    FROM podcasts
                                    WHERE podcast_id = $1`;
            const check  = await db.query(duplicate_check, [data.id]);
            
            // console.log("Dupe count :", check.rows[0].count);

            if (check.rows[0].count === "0") {


                console.log(`Adding podcast ${data.id}`);

                const sql = `INSERT INTO podcasts (
                                podcast_id, date_created, podcast_post_url, slug, 
                                title, content, excerpt, featured_image, editor, 
                                mp3_file_url)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                            RETURNING *`;
                const values = [
                    data.id,
                    data.date_created,
                    data.podcast_post_url,
                    data.slug,
                    data.title,
                    data.content,
                    data.excerpt,
                    data.featured_image,
                    data.author,
                    data.mp3_file_url
                ];

                const result = await db.query(sql, values);

                let podcast = result.rows[0];

                return podcast;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertResponses(data){
    try {

        if (data) {

            const duplicate_check = await db.query(
                `SELECT COUNT(*)
                FROM responses
                WHERE response_id = $1`,
                [data.response_id]);

            if (duplicate_check.rows[0].count === "0") {

                if (data.podcast_id === undefined) data.podcast_id = 0;
                
                console.log(`Adding response ${data.response_id} from podcast ${data.podcast_id}`);

                const sql = `INSERT INTO responses (
                                response_id, date_created, podcast_id, 
                                title, slug, content, excerpt, featured_image)  
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                            RETURNING *`;
                const values = [
                    data.response_id,
                    data.date_created,
                    data.podcast_id,
                    data.title,
                    data.slug,
                    data.content,
                    data.excerpt,
                    data.featured_image
                ];

                const result = await db.query(sql, values);

                let Response = result.rows[0];

                return Response;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertTags(data) {
    try {

        if(data){

            const duplicate_check = await db.query(
                `SELECT COUNT(*)
                FROM tags
                WHERE tag_id = $1`,
                [data.tag_id]);

            if (duplicate_check.rows[0].count === "0") {

                console.log(`Adding tag ${data.tag_id}`);

                const sql = `INSERT INTO tags (
                                tag_id, name, slug, count)
                            VALUES ($1, $2, $3, $4)
                            RETURNING *`;
                const values = [
                    data.tag_id,
                    data.name,
                    data.slug,
                    data.count,
                ];

                const result = await db.query(sql, values);

                let Tag = result.rows[0];

                return Tag;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertTypes(data) {
    try {

        if(data){

            const duplicate_check = await db.query(
                `SELECT COUNT(*)
                FROM types
                WHERE name = $1`,
                [data.type]);

            if (duplicate_check.rows[0].count === "0") {

                console.log(`Adding type ${data.type}`);


                const sql = `INSERT INTO types (
                                name)
                            VALUES ($1)
                            RETURNING *`;
                const values = [data.type];
                const result = await db.query(sql, values);

                let type = result.rows[0];

                return type;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertPodcastContributors (data) {
    try {

        if(data){

            for (let contributor of data.contributors) {

                const duplicate_check = await db.query(
                    `SELECT COUNT(*)
                    FROM podcast_contributors
                    WHERE podcast_id = $1 AND contributor_id = $2`,
                    [data.id, contributor]);

                if (duplicate_check.rows[0].count === "0") {

                    console.log(`Adding contributor ${contributor} to podcast ${data.id}`);
        
                    const sql = `INSERT INTO podcast_contributors (
                                    podcast_id, contributor_id)
                                VALUES ($1, $2)
                                RETURNING *`;
                    const values = [data.id, contributor];
                    
                    await db.query(sql, values);

                    // let podcastContributor = result.rows[0];

                    // return podcastContributor;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertPodcastTags(data) {
    try {
        if (data)  {
            // console.log(data.tags)
            for (let tag of data.tags) {
                

                const duplicate_check = await db.query(
                    `SELECT COUNT(*) 
                    FROM podcast_tags 
                    WHERE podcast_id = $1 and tag_id = $2`, 
                    [data.id, tag]);

                if (duplicate_check.rows[0].count === "0") {
                    

                    console.log(`Adding tag ${tag} from podcast ${data.id}`);

                    const sql = `INSERT INTO podcast_tags (
                                    podcast_id, tag_id)
                                VALUES ($1, $2)
                                RETURNING *`;

                    const values = [data.id, tag];

                    await db.query(sql, values);

                    // let podcastTag = result.rows[0];

                    // return podcastTag;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertPodcastResponses(data) {
    try {
        if (data) {

            for (let response of data.response) {

                const duplicate_check = await db.query(
                    `SELECT COUNT(*) 
                    FROM podcast_responses 
                    WHERE podcast_id = $1 and response_id = $2`, 
                    [data.id, response]);

                if (duplicate_check.rows[0].count === "0") {

                    console.log(`Adding response ${response} from podcast ${data.id}`);

                    const sql = `INSERT INTO podcast_responses (
                                    podcast_id, response_id)
                                VALUES ($1, $2)
                                RETURNING *`;

                    const values = [data.id, response];

                    await db.query(sql, values);

                    // let podcastResponse = result.rows[0];

                    // return podcastResponse;
                }
            }
        }   
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertResponseContributors (data) {
    try {
        if (data.contributors) {
            

            for (let contributor of data.contributors) {

                const duplicate_check = await db.query(
                    `SELECT COUNT(*)
                    FROM response_contributors
                    WHERE response_id = $1 and contributor_id = $2`,
                    [data.response_id, contributor]);

                if (duplicate_check.rows[0].count === "0") {

                    console.log(`Adding contributor ${contributor} to response ${data.response_id}`);

                    const sql = `INSERT INTO response_contributors (
                                    response_id, contributor_id)
                                VALUES ($1, $2)
                                RETURNING *`;

                    const values = [data.response_id, contributor];

                    const result = await db.query(sql, values);

                    let responseContributor = result.rows[0];

                    return responseContributor;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function dbInsertMediaLinks(data) {
    try {
        if (data) {

            const result = await db.query(
                `UPDATE podcasts 
                SET featured_image_url = $2 
                WHERE podcast_id = $1`, 
                [data.id, data.featured_image_url]);
            
        }
    } catch (err) {
        console.log(err);
    }
}


module.exports = {  dbInsertMediaLinks, 
                    dbInsertResponseContributors, 
                    dbInsertPodcastResponses, 
                    dbInsertPodcastTags, 
                    dbInsertPodcastContributors, 
                    dbInsertTypes, 
                    dbInsertContributors, 
                    dbInsertEditors, 
                    dbInsertPodcasts, 
                    dbInsertResponses, 
                    dbInsertTags };