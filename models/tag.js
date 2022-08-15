const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Tags. */

class Tag {

    /**
     * 
     * No create method exists, because tags are read-only.
     * 
     */

      static async findAll(searchFilters = {}) {

         let query = `SELECT * FROM tags`;
         let whereExpressions = [];
         let queryValues = [];

         const { name, page, limit } = searchFilters;

         if (name) {
            queryValues.push(`%${name}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
         }

         query += ` ORDER BY count DESC`;

         const response = await db.query(query, queryValues);
      
         let pagination = [];

         let total = (response.rows).length;

         let pages =  Math.floor(total / (limit || 10));

         if (page && limit) {
            
            total = (response.rows).length;

            pages = Math.floor(total / limit) > 0 ? Math.floor(total / limit) : 1;

            for (let i = 0 + (page - 1)*limit; i < limit*page; i++){
               if (response.rows[i]){
                  pagination.push(response.rows[i]);
               }
            }

         };

         return { 
                  "total_results": total, 
                  "total_pages": pages, 
                  "page" : +page, 
                  "limit" : +limit,
                  "page_results": pagination,  
                  "full_results": response.rows  
               } 

      }

      static async getTagBySlug(slug) {
        const tags = await db.query(
           `SELECT * FROM tags WHERE slug = $1`,
           [slug]);
        const tag = tags.rows[0];
  
        if (!tag) throw new NotFoundError(`Tag not found`); 
  
        return tag;
      }

      static async getTagById(id) {
         const tag = await db.query(
             `SELECT * FROM tags WHERE tag_id = $1`,
               [id]);
            const tagResult = tag.rows[0];
   
            if (!tagResult) throw new NotFoundError(`Tag not found`); 
   
            return tagResult;
      }

      static async getPodcastsByTagId(podcastId) {
         const tags = await db.query(
             `SELECT podcast_id FROM podcast_tags WHERE tag_id = $1`,
               [podcastId]);
            const tagResult = tags.rows;
   
            if (!tagResult) throw new NotFoundError(`Podcast not found`); 
   
            return tagResult;
      }

      // Deprecated by addition of search filters to "/" method
      // static async searchTags(name) {
      //    let query = `SELECT * FROM tags`;
      //    let whereExpressions = [];
      //    let queryValues = [];
         
      //    if (name) {
      //        whereExpressions.push("name ILIKE $1");
      //        queryValues.push(`%${name}%`);
      //        query += ` WHERE ${whereExpressions.join(" AND ")}`;
             
      //    } 
 
      //    const result = await db.query(query, queryValues);
      //    return result.rows;
 
      // }

}

module.exports = Tag;