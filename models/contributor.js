"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { getMediaURL } = require("../helpers/model_queries");

/** Related functions for Contributors. */

class Contributor {
     
    static async getContributorBySlug(slug) {
        const persons = await db.query(
            `SELECT * FROM contributors WHERE slug = $1`,
            [slug]);
        const person = persons.rows[0];

        if (!person) throw new NotFoundError(`Contributor not found`); 

        return person;
    }

    static async getContributorById(id) {
        const persons = await db.query(
            `SELECT * FROM contributors WHERE contributor_id = $1`,
            [id]);
        
        const person = persons.rows[0];

        if (!person) throw new NotFoundError(`Contributor not found`);

        return person
    }

    static async findAll(searchFilters = {}) {
        let query = `SELECT * FROM contributors`;
        let whereExpressions = [];
        let queryValues = [];

        const { name, page, limit } = searchFilters; 

        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
        if (name) {
            queryValues.push(`%${name}%`);
            whereExpressions.push("name ILIKE $1");
            
        }

        if (whereExpressions.length > 0) {
            query += ` WHERE ${whereExpressions.join(" AND ")}`;
        }

        query += ` ORDER BY name`;

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

        return await getMediaURL("persons", id);
    }
}

module.exports = Contributor;