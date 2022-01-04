const {
  TwitterApi
} = require("twitter-api-v2");

const express = require("express");
const cors = require("cors");
const appOnlyClient = new TwitterApi(process.env.ADVANCED_BEARER);
const termsClient = appOnlyClient.readOnly;

const router = express.Router();

router.use(cors());

/*
manipola i dati, contando le occorrenza di una certa parola nei tweets
(quanto un trend è popolare)
se il trend è null o 1 lo ignora
*/
function organizeTrendsOfPlace(trendsOfPlace){
  let r = [];

  for (const { trends } of trendsOfPlace) {
    for (const trend of trends) {
      let count = 1;
      // if volume is not null set count
      if (trend.tweet_volume > 1) {
        count = trend.tweet_volume;
        let item = { value: trend.name, count: count };
        r.push(item);
      }
    }
  }

  return r;
}

/*
gestisce la richiesta con req
*/
async function searchTerms(req, client = termsClient) {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  let place = (await client.v1.trendsClosest(latitude, longitude)).pop().woeid;
  return client.v1.trendsByPlace(place);
}

router.get("/", async (req, res) => {
  let trendsOfPlace = await searchTerms(req);
  let result = organizeTrendsOfPlace(trendsOfPlace)
  res.send(result);
});

module.exports = { router, organizeTrendsOfPlace, searchTerms };
