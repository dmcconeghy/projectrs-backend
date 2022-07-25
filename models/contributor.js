"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const DATA = require("../json/contributors.json");

/** Related functions for Tags. */

class Contributor {
     /** 
      * Create a tag (from data), 
      * update db, 
      * return new tag data.
      * 
      **/

    static async searchJSON(name) {
        const result = Object.values(DATA);
        console.log("name : ", name);
        let contributor = result.filter(contributor => contributor.name === name);
        return contributor;
    }

     static async create(data) {
        const result = await db.query(
              `INSERT INTO contributors (contributor_id,
                                     name,
                                     slug,
                                     bio_text,
                                     profile_image,
                                     type)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING contributor_id, name, slug, bio_text, profile_image, type`,
           [
            data.contributor_id,
            data.name,
            data.slug,
            data.bio_text,
            data.profile_image,
            data.type
           ]);
        let contributor = result.rows[0];

        return contributor;
     }

     static async findAll({ name } = {}) {
        let query = `SELECT * FROM contributors`;
        let whereExpressions = [];
        let queryValues = [];

        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
        if (title) {
            whereExpressions.push("name ILIKE $1");
            queryValues.push(`%${name}%`);
        }

        if (whereExpressions.length > 0) {
            query += ` WHERE ${whereExpressions.join(" AND ")}`;
        }

        const result = await db.query(query, queryValues);
        let contributors = result.rows;

        return contributors;
     }
}

module.exports = Contributor;