const { TwitterApi } = require("twitter-api-v2");
const dayjs = require("dayjs");
const Axios = require("axios");
require("dotenv").config();

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

let previousQuote = "";

(function PostYuanQuoteOnTwitter() {
  Axios.get("https://economia.awesomeapi.com.br/last/CNY-BRL")
    .then((res) => {
      const tweet =
        previousQuote > parseFloat(res.data.CNYBRL.bid)
          ? `📊 Yuan caiu 😁 - R$ ${res.data.CNYBRL.bid} às ${dayjs(
              res.data.CNYBRL.create_date
            ).format("HH:mm")} 💵`
          : `📊 Yuan subiu 😱 - R$ ${res.data.CNYBRL.bid} às ${dayjs(
              res.data.CNYBRL.create_date
            ).format("HH:mm")} 💵`;

      if (previousQuote !== parseFloat(res.data.CNYBRL.bid)) {
        client.v2
          .tweet(tweet)
          .then((val) => {
            console.log(val);
          })
          .catch((err) => {
            console.log(err);
          });
        previousQuote = parseFloat(res.data.CNYBRL.bid);
      }
    })
    .catch((err) => console.error(err));
  setTimeout(function () {
    PostYuanQuoteOnTwitter();
  }, 30000);
})();
