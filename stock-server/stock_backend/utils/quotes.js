var yahooFinance = require('yahoo-finance');

yahooFinance.quote(
  {
    symbol: 'META',
    modules: ['price', 'summaryDetail'],
    // modules: ['price'],
  },
  function (err, quotes) {
    // console.log(quotes.price.preMarketPrice);
    console.log(quotes.price.regularMarketPrice);
  }
);
