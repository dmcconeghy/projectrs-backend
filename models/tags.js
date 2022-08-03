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

      static async getTagById(id) {
         const tag = await db.query(
             `SELECT * FROM tags WHERE tag_id = $1`,
               [id]);
            const tagResult = tag.rows[0];
   
            if (!tagResult) throw new NotFoundError(`Tag not found`); 
   
            return tagResult;
      }

      static async findAll(searchFilters = {}) {
         let query = `SELECT * FROM tags`;
         let whereExpressions = [];
         let queryValues = [];

         const { name, page, limit } = searchFilters;

         if (name) {
            queryValues.push(`%${name}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
         }

        const result = await db.query(query, queryValues);

         if (page && limit) {
         
            let total = (result.rows).length;
   
            // let pages = Math.floor(total / limit);
   
            let subset = []
   
            for (let i = 0 + (page - 1)*limit; i < limit*page; i++){
               if (result.rows[i]){
                  subset.push(result.rows[i])
               }
            }
   
            return subset
         } 

         return result.rows;

      }
}

module.exports = Tag;