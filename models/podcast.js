"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Podcasts. */

class Podcast {
     /** 
      * Create a podcast (from data), 
      * update db, 
      * return new podcast data.
      * 
      **/


     static async create(data) {
        const result = await db.query(
              `INSERT INTO podcasts (podcast_id,
                                    date_created,
                                    podcast_post_url,
                                    slug,
                                    title,
                                    content,
                                    excerpt,
                                    featured_image,
                                    editor,
                                    mp3_file_url,
                                    type,
                                    transcript)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
               RETURNING    podcast_id, 
                            date_created, 
                            podcast_post_url, 
                            slug, 
                            title, 
                            content, 
                            excerpt, 
                            featured_image, 
                            editor, 
                            mp3_file_url, 
                            type
                            transcript`,
           [
            data.podcast_id,
            data.date_created,
            data.podcast_post_url,
            data.slug,
            data.title,
            data.content,
            data.excerpt,
            data.featured_image,
            data.editor,
            data.mp3_file_url,
            data.type,
            data.transcript
           ]);
        let podcast = result.rows[0];

        return podcast;
     }

     static async findAll({ title } = {}) {
        let query = `SELECT * FROM podcasts`;
        let whereExpressions = [];
        let queryValues = [];

        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
        if (title) {
            whereExpressions.push("title ILIKE $1");
            queryValues.push(`%${title}%`);
        }

        if (whereExpressions.length > 0) {
            query += ` WHERE ${whereExpressions.join(" AND ")}`;
        }

        const result = await db.query(query, queryValues);
        let podcasts = result.rows;

        return podcasts;
     }
}

module.exports = Podcast;