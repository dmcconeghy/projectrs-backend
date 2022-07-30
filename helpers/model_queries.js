const axios = require("axios");

async function getMediaURL(type, id) {
    console.log("fetching a media URL")
    
    const res = await axios(`https://religiousstudiesproject.com/wp-json/wp/v2/${type}/${id}`);

    // console.log(res)

    const media_id =  res.data.featured_media // returns wordpress media id.

    console.log(media_id)

    const media_res = await axios(`https://religiousstudiesproject.com/wp-json/wp/v2/media/${media_id}`);

    return media_res.data.guid.rendered;
}

module.exports = { getMediaURL };