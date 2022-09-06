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

const diferencaCotacao = () => {
  const resto = previousQuote > res.data.CNYBRL.bid ? previousQuote % res.data.CNYBRL.bid > 0.0005 : res.data.CNYBRL.bid % previousQuote > 0.0005;
  return resto
}

(function PostYuanQuoteOnTwitter() {
  Axios.get("https://economia.awesomeapi.com.br/last/CNY-BRL")
    .then((res) => {
      const tweet =
        previousQuote > res.data.CNYBRL.bid
          ? `📊 Yuan caiu 😁 - R$ ${res.data.CNYBRL.bid} às ${dayjs(
            res.data.CNYBRL.create_date
          ).format("HH:mm")} 💵`
          : `📊 Yuan subiu 😱 - R$ ${res.data.CNYBRL.bid} às ${dayjs(
            res.data.CNYBRL.create_date
          ).format("HH:mm")} 💵`;

      if (diferencaCotacao()) {
        client.v2
          .tweet(tweet)
          .then((val) => {
            console.log(val);
          })
          .catch((err) => {
            console.log(err);
          });
        previousQuote = res.data.CNYBRL.bid;
      }
    })
    .catch((err) => console.error(err));
  setTimeout(function () {
    PostYuanQuoteOnTwitter();
  }, 2 * 60000);
})();
