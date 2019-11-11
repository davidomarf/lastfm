const axios = require("axios");

const lastFmAPI = process.env.REACT_APP_LAST_FM_API;
const lastFmCall =
  "https://ws.audioscrobbler.com/2.0/?format=json&api_key=" + lastFmAPI;

async function getData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Exported functions used in UserPage

/**
 * Returns the number of scrobbles the user has
 * @param {string} user Last.fm user
 * @returns {Promise} Response to the method https://www.last.fm/api/show/user.getInfo
 */
function getUserPlayCount(user) {
  let playCount = getData(lastFmCall + "&method=user.getinfo&user=" + user);
  return playCount;
}

/**
 * Returns the specified page from the user's scrobble list. Each page has 200 entries.
 * @param {string} user
 * @param {number} page Page of the
 * @returns {Promise} Response to the method https://www.last.fm/api/show/user.getRecentTracks
 */
function getScrobbles(user, page) {
  return getData(
    `${lastFmCall}&method=user.getrecenttracks&limit=200&user=${user}&page=${page}`
  );
}

module.exports = {
  getScrobbles,
  getUserPlayCount
};
