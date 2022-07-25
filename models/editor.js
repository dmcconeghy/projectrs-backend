"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const DATA = require("../json/editors.json");

/** Related functions for Tags. */

class Editor {
     /** 
      * Create a tag (from data), 
      * update db, 
      * return new tag data.
      * 
      **/

    static async searchJSON(name) {
        const result = Object.values(DATA);
        console.log("name : ", name);
        let editor = result.filter(editor => editor.name === name);
        return editor;
    }

     static async create(data) {
        const result = await db.query(
              `INSERT INTO editors (editor_id,
                                     name,
                                     slug,
                                     avatar_image_url)
               VALUES ($1, $2, $3, $4)
               RETURNING editor_id, name, slug, avatar_image_url`,
           [
            data.editor_id,
            data.name,
            data.slug,
            data.avatar_image_url,
           ]);
        let editor = result.rows[0];

        return editor;
     }

     static async findAll({ name } = {}) {
        let query = `SELECT * FROM editors`;
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
        let editors = result.rows;

        return editors;
     }
}

module.exports = Editor;