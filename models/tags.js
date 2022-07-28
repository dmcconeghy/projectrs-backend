"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Tags. */

class Tag {

    /**
     * 
     * No create method exists, because tags are import-only.
     * 
     */

      static async getTagBySlug(slug) {
        const tags = await db.query(
           `SELECT * FROM tags WHERE slug = $1`,
           [slug]);
        const tag = tags.rows[0];
  
        if (!tag) throw new NotFoundError(`Tag not found`); 
  
        return tag;
        }

     static async searchTags(name) {
        let query = `SELECT * FROM tags`;
        let whereExpressions = [];
        let queryValues = [];
        
        if (name) {
            whereExpressions.push("name ILIKE $1");
            queryValues.push(`%${name}%`);
            query += ` WHERE ${whereExpressions.join(" AND ")}`;
            
        } 

        const result = await db.query(query, queryValues);
        return result.rows;

        }

}

module.exports = Tag;