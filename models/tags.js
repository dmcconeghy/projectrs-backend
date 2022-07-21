"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Tags. */

class Tag {
     /** 
      * Create a tag (from data), 
      * update db, 
      * return new tag data.
      * 
      **/

     static async create(data) {
        const result = await db.query(
              `INSERT INTO tags (tag_id,
                                     name,
                                     slug,
                                     count)
               VALUES ($1, $2, $3, $4)
               RETURNING tag_id, name, slug, count`,
           [
             data.tag_id,
             data.name,
             data.slug,
             data.count,
           ]);
        let tag = result.rows[0];

        return tag;
     }

     static async findAll({ name } = {}) {
        let query = `SELECT * FROM tags`;
        let whereExpressions = [];
        let queryValues = [];

        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
        if (title) {
            whereExpressions.push("title ILIKE $1");
            queryValues.push(`%${name}%`);
        }

        if (whereExpressions.length > 0) {
            query += ` WHERE ${whereExpressions.join(" AND ")}`;
        }

        const result = await db.query(query, queryValues);
        let tags = result.rows;

        return tags;
     }
}

module.exports = Tag;