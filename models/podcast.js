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

      const result = await db.query(query, queryValues);

      if (page && limit) {
         
         let total = (result.rows).length;

         let pages = Math.floor(total / limit);

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

   static async getTagsByPodcastId(podcastId) {
      const tags = await db.query(
          `SELECT * FROM podcast_tags WHERE podcast_id = $1`,
            [podcastId]);
         const tagResult = tags.rows;

         if (!tagResult) throw new NotFoundError(`Tags not found`); 

         return tagResult;
   }

   static async fetchMedia(id) {

      return await getMediaURL("podcast", id);
   }
}

module.exports = Podcast;