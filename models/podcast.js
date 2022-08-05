"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { getMediaURL } = require("../helpers/model_queries");
const Contributor = require("./contributor");

/** Related functions for Podcasts. */

class Podcast {
     /** 
      * Create a podcast (from data), 
      * update db, 
      * return new podcast data.
      * 
      **/
   
   static async getPodcastBySlug(slug) {
      
      const podcasts = await db.query(
         `SELECT * FROM podcasts WHERE slug = $1`,
         [slug]);
      const podcast = podcasts.rows[0];

      if (!podcast) throw new NotFoundError(`Podcast not found`); 

      return podcast;
      }
   static async getPodcastById(id) {

      const podcasts = await db.query(
         `SELECT * FROM podcasts WHERE podcast_id = $1`,
         [id]);

      const podcast = podcasts.rows[0];

      if (!podcast) throw new NotFoundError(`Podcast not found`);

      return podcast
   }

   static async findAll(searchFilters = {}) {
      let query = `SELECT * FROM podcasts`;
      let whereExpressions = [];
      let queryValues = [];

      const { title, content, contributor, page, limit } = searchFilters; 

      // For each possible search term, add to whereExpressions and
      // queryValues so we can generate the right SQL
      if (title) {
         queryValues.push(`%${title}%`);
         whereExpressions.push(`title ILIKE $${queryValues.length}`);
      }

      if (content) {
         queryValues.push(`%${content}%`);
         whereExpressions.push(`content ILIKE $${queryValues.length}`);
      }

      if (contributor) {
         const persons = await Contributor.findAll({ "name" : contributor });
         
         const people_ids = persons.map(person => person.contributor_id);

         for (const person of people_ids) {
            const union = `SELECT * FROM podcast_contributors WHERE contributor_id = ${person}`;
            const result = await db.query(union);
            
            for (const row of result.rows) {
               queryValues.push(row.podcast_id);
               
               whereExpressions.push(`podcast_id = $${queryValues.length}`);
               
            }
           
         }
         // queryValues.push(`%${persons}%`);
         // whereExpressions.push(`content ILIKE $${queryValues.length}`);
      }

      if (whereExpressions.length > 0) {
         query += ` WHERE ${whereExpressions.join(" OR ")}`;
      }

      query += ` ORDER BY date_created ASC`;

      const response = await db.query(query, queryValues);

      let pagination = [];

      let total = (response.rows).length;

      let pages =  Math.floor(total / (limit || 10));

      if (page && limit) {
         
         total = (response.rows).length;

         pages = Math.floor(total / limit);

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

   static async getTagsByPodcastId(podcastId) {
      const tags = await db.query(
          `SELECT tag_id FROM podcast_tags WHERE podcast_id = $1`,
            [podcastId]);
         const tagsResult = tags.rows;

         if (!tagsResult) throw new NotFoundError(`Tags not found`); 

         return tagsResult;
   }

   static async fetchMedia(id) {

      return await getMediaURL("podcast", id);
   }
}

module.exports = Podcast;