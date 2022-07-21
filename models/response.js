"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Tags. */

class Response {
     /** 
      * Create a response (from data), 
      * update db, 
      * return new response data.
      * 
      **/

     static async create(data) {
        const result = await db.query(
              `INSERT INTO responses (response_id,
                                     date_created,
                                     podcast_id,
                                     title,
                                     slug,
                                     content,
                                     excerpt,
                                     featured_image,
                                     editor,
                                     contributor,
                                     type
                                    )
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
               RETURNING    response_id, 
                            date_created, 
                            podcast_id,
                            title,
                            slug, 
                            content, 
                            excerpt, 
                            featured_image, 
                            editor, 
                            contributor, 
                            type`,
           [
            data.response_id,
            data.date_created,
            data.podcast_id,
            data.title,
            data.slug,
            data.content,
            data.excerpt,
            data.featured_image,
            data.editor,
            data.contributor,
            data.type,
           ]);
        let response = result.rows[0];

        return response;
     }

     static async findAll({ title } = {}) {
        let query = `SELECT * FROM responses`;
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
        let responses = result.rows;

        return responses;
     }
}

module.exports = Response;