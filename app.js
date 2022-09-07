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

let previousQuote = 0.7533;

(function PostYuanQuoteOnTwitter() {
  Axios.get("https://economia.awesomeapi.com.br/last/CNY-BRL")
    .then((res) => {
      const diferencaCotacao = () => {
        const resto =
          previousQuote > res.data.CNYBRL.bid
            ? previousQuote % res.data.CNYBRL.bid > 0.0003
            : res.data.CNYBRL.bid % previousQuote > 0.0003;
        return resto;
      };

      const tweet =
        previousQuote > parseFloat(res.data.CNYBRL.bid)
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
        previousQuote=res.data.CNYBRL.bid
        console.log(res.data.CNYBRL.bid);
      }else{
        console.log("tudo igual ainda \n")
      }
    })
    .catch((err) => console.error(err));
  setTimeout(function () {
    PostYuanQuoteOnTwitter();
  }, 2*60000);
})();
