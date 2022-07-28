/**
 * Helper functions for generating JSON archives of ProjectRS data.
 * 
 */

 const axios = require("axios");

async function getAllPodcasts() {
    console.log("fetching podcasts")

    let fullres = [];
    
    const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=1");
    const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=2");
    const res3 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=3");
    const res4 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=4");
    const res5 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=5");

    fullres = [...res1.data, ...res2.data, ...res3.data, ...res4.data, ...res5.data];

    const res6 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=6");
    const res7 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=7");
    const res8 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=8");
    const res9 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=50&page=9");

    fullres = [...fullres, ...res6.data, ...res7.data, ...res8.data, ...res9.data];
    
    return fullres
    
}

async function getAllContributors(){
    console.log("fetching contributors")

    let fullres = [];

    const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=1");
    const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=2");
    const res3 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=3");
    const res4 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=4");
    const res5 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=5");

    fullres = [...res1.data, ...res2.data, ...res3.data, ...res4.data, ...res5.data];

    const res6 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=6");
    const res7 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=7");
    const res8 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=8");
    const res9 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=9");
    const res10 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=10");

    fullres = [...fullres, ...res6.data, ...res7.data, ...res8.data, ...res9.data, ...res10.data];

    const res11 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=11");
    const res12 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=12");
    const res13 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=13");
    const res14 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=50&page=14");

    fullres = [...fullres, ...res11.data, ...res12.data, ...res13.data, ...res14.data];

    return fullres
    
}

async function getAllEditors() {
    console.log("fetching editors")

    const res = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/users?per_page=100");

    return [...res.data];
}

async function getAllTags(){
    console.log("fetching tags")

    let fullres = [];

    const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=1");
    const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=2");
    const res3 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=3");
    const res4 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=4");
    const res5 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=5");

    fullres = [...res1.data, ...res2.data, ...res3.data, ...res4.data, ...res5.data];

    const res6 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=6");
    const res7 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=7");
    const res8 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=8");
    const res9 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=9");
    const res10 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=10");

    fullres = [...fullres, ...res6.data, ...res7.data, ...res8.data, ...res9.data, ...res10.data];

    const res11 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=11");
    const res12 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=12");
    const res13 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=13");
    const res14 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/tags/?per_page=50&page=14");

    fullres = [...fullres, ...res11.data, ...res12.data, ...res13.data, ...res14.data];

    return fullres

}

async function getAllResponses(){
    console.log("fetching responses")

    let fullres = [];
    
    const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=1");
    const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=2");
    const res3 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=3");
    const res4 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=4");
    const res5 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=5");

    fullres = [...res1.data, ...res2.data, ...res3.data, ...res4.data, ...res5.data];

    const res6 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=6");
    const res7 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=7");
    const res8 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/response/?per_page=50&page=8");

    fullres = [...fullres, ...res6.data, ...res7.data, ...res8.data];
    
    return fullres
}

module.exports = { getAllPodcasts, getAllContributors, getAllEditors, getAllTags, getAllResponses };


/**
 *  Shorter test code for running test queries. 
 * 
 *   // const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=1&page=1");
 *   // const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/persons/?per_page=1&page=2");
 *   
 *   // fullres = [...res1.data,...res2.data];
 * 
 *   // const res1 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=1&page=1");
 *   // const res2 = await axios("https://religiousstudiesproject.com/wp-json/wp/v2/podcast/?per_page=1&page=2");
 *
 *   // fullres = [...res1.data, ...res2.data];
 */