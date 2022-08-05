"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { getMediaURL } = require("../helpers/model_queries");
const Contributor = require("./contributor");

/** Related functions for Responses. */

class Response {

   static async getResponseBySlug(slug) {
      const responses = await db.query(
         `SELECT * FROM responses WHERE slug = $1`,
         [slug]);
      const response =responses.rows[0];

      if (!response) throw new NotFoundError(`Response not found`); 

      return response;
      }

   static async getResponseById(id) {

   const responses = await db.query(
      `SELECT * FROM responses WHERE response_id = $1`,
      [id]);

   const response = responses.rows[0];

   if (!response) throw new NotFoundError(`Response not found`);

   return response
   }

   static async findAll(searchFilters = {}) {
      let query = `SELECT * FROM responses`;
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
         const persons = await Contributor.findAll({ "name": contributor });
         
         const people_ids = persons.map(person => person.contributor_id);

         for (const person of people_ids){
            const union = `(SELECT * FROM response_contributors WHERE contributor_id = ${person})`;
            const result = await db.query(union);
            
            for (const row of result.rows) {
               
               queryValues.push(row.response_id);
               whereExpressions.push(`response_id = $${queryValues.length}`);
            }
         }

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

   static async fetchMedia(id) {

      return await getMediaURL("response", id);
   }

}

module.exports = Response;