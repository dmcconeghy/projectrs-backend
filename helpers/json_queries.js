/**
 * Helper functions for testing Wordpress API calls.
 * 
 */

const fs = require("fs");
const path = require("path");

async function getJSPodcasts() {
    console.log("fetching podcasts from JSON archive")
    
    const res = fs.readFileSync(path.join(__dirname, "../json", "podcasts.json"), 'utf8', (err) => {
        if (err) throw err;
    });
    
    return JSON.parse(res)  // returns podcast json data.
}

async function getJSTags() {
    console.log("fetching tags from JSON archive")

    const res = fs.readFileSync(path.join(__dirname, "../json", "tags.json"), 'utf8', (err) => {
        if (err) throw err;
    });
    
    return JSON.parse(res)// returns tags json data.
}

async function getJSResponses() {
    console.log("fetching responses from JSON archive")
    
    const res = fs.readFileSync(path.join(__dirname, "../json", "responses.json"), 'utf8', (err) => {
        if (err) throw err;
    });

    return JSON.parse(res) // returns response json data.
}

async function getJSContributors() {
    console.log("fetching contributors from JSON archive")
    
    const res = fs.readFileSync(path.join(__dirname, "../json", "contributors.json"), 'utf8', (err) => {
        if (err) throw err;
    });
    
    return JSON.parse(res) // returns contributors json data.
}

async function getJEditors() {
    console.log("fetching editors from JSON archive")
    
    const res = fs.readFileSync(path.join(__dirname, "../json", "editorss.json"), 'utf8', (err) => {
        if (err) throw err;
    });
    
    return JSON.parse(res) // returns editors json data.
}

module.exports = { getJSPodcasts, getJSTags, getJSResponses, getJSContributors, getJEditors };