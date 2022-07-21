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

async function getAllPodcasts() {
    console.log("fetching podcasts")
    
    const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=100&page=1");
    const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=100&page=2");
    const res3 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=100&page=3");
    const res4 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=100&page=4");
    const res5 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=100&page=5");

    fullres = [...res1.data, ...res2.data, ...res3.data, ...res4.data, ...res5.data];
    // console.log(fullres)
    return fullres  // returns podcast json data.
}

async function getTags() {
    console.log("fetching tags")

    const res = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags");

    return res // returns tags json data.
}

async function getResponses() {
    console.log("fetching responses")
    
    const res = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/");

    return res // returns tags json data.
}

async function getContributors() {
    console.log("fetching contributors")
    
    const res = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/");

    return res // returns tags json data.
}

module.exports = { getPodcasts, getAllPodcasts, getTags, getResponses, getContributors };