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
              `INSERT INTO podcasts (title,
                                     description,
                                     imageUrl,
                                     episodes)
               VALUES ($1, $2, $3, $4)
               RETURNING id, title, description, imageUrl, episodes`,
           [
             data.title,
             data.description,
             data.imageUrl,
             data.episodes,
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