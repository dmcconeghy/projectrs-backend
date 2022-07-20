/**
 * Helper functions for testing Wordpress API calls.
 * 
 */

const axios = require("axios");

async function getPodcasts() {
    console.log("fetching podcasts")
    
    const res = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/");
    
    return res  // returns podcast json data.
}

async function getTags() {
    console.log("fetching tags")
    const res = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags");

    return res // returns tags json data.
}

module.exports = { getPodcasts, getTags };